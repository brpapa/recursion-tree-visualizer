output "ecr_repository_url" {
  value = aws_ecr_repository.this.repository_url
}

output "lambda_function_arn" {
  value = aws_lambda_function.this.arn
}

output "api_gw_url" {
  value = aws_api_gateway_deployment.api_deployment.invoke_url
}
