terraform {
  required_providers {
    aws    = { source = "hashicorp/aws", version = ">= 5.0" }
  }

  required_version = ">= 1.0.0"
}

provider "aws" {
  profile    = var.profile
  region     = var.region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key

  default_tags {
    tags = {
      app = "recursion-tree-visualizer"
    }
  }
}

# ecr repository

resource "aws_ecr_repository" "this" {
  name                 = var.image_name
  image_tag_mutability = "MUTABLE"
}


resource "aws_ecr_lifecycle_policy" "this" {
  # ecr lifecycle policy to expire/remove untagged images

  depends_on = [aws_ecr_repository.this]
  repository = aws_ecr_repository.this.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images older than 1 day"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 1
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# if any file within lambda/** changes, run docker build locally and push a new image with latest tag to ECR repository 

locals {
  lambda_path         = "${path.module}/../lambda"
  lambda_files_hashes = join("", [for file in fileset("${local.lambda_path}", "**/*") : filemd5("${local.lambda_path}/${file}")])
  lambda_hash         = md5(local.lambda_files_hashes)
}

resource "null_resource" "local_docker_build_tag_push" {
  depends_on = [aws_ecr_repository.this]

  triggers = {
    lambda_hash = local.lambda_hash
  }

  provisioner "local-exec" {
    working_dir = local.lambda_path
    command     = <<EOT
      aws ecr get-login-password --profile ${var.profile} --region ${var.region} | docker login --username AWS --password-stdin ${aws_ecr_repository.this.repository_url}

      docker build --platform linux/arm64 -t ${var.image_name} .
      docker tag ${var.image_name}:latest ${aws_ecr_repository.this.repository_url}:latest
      docker push ${aws_ecr_repository.this.repository_url}:latest
    EOT
  }
}

data "aws_ecr_image" "latest" {
  depends_on = [null_resource.local_docker_build_tag_push]

  repository_name = aws_ecr_repository.this.name
  image_tag       = "latest"
}

# lambda

resource "aws_lambda_function" "this" {
  depends_on = [data.aws_ecr_image.latest, aws_iam_role.lambda_execution]

  function_name = var.function_name
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.this.repository_url}@${data.aws_ecr_image.latest.image_digest}" # include the current image digest of latest tag to force lambda update if a new image was pushed
  role          = aws_iam_role.lambda_execution.arn
  timeout       = 30
}


# iam role that the lambda will assume
resource "aws_iam_role" "lambda_execution" {
  name = "${var.function_name}_lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name = "${var.function_name}_lambda_policy"
  description = "Policy for Lambda to write logs to CloudWatch"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  # attach policy to the role
  role       = aws_iam_role.lambda_execution.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}
