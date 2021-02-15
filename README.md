<div align="center">
  <img src="./assets/logo.svg" height="100"/>
</div>

<h1 align="center">Recursion Tree Visualizer</h1>

<p align="center">🥇 Winner project of the <a href="https://www.algoexpert.io/swe-project-contests/2020-summer">AlgoExpert SWE Project Contest</a> 🥇</p>

## Overview

Stop drawing recursion trees by hand. Watch the [demo video](https://youtu.be/1f-KeeN8AHs) or check out the [live project](https://recursion.now.sh).

### Folders structure

- `packages/web`: web user interface. Deployed on Vercel. Built with React, Styled Components and PrismJS.
- `packages/lambda`: a lambda function for the remote code runner. Deployed on AWS Lambda as a container. Built with Node.

## Local development 

### Web

In the `packages/web` directory, run:

```bash
# to install all dependencies
> npm install

# to run the app on http://localhost:3000
> npm run start
```

### Lambda function

In the `packages/lambda` directory: 

Use the Amazon Runtime Interface Emulator (RIE), contained in the image, to test the lambda function locally:

```bash
# build you local image
> docker build --tag test . 

# create and run a container using AWS RIE as executable to emulate a server for your lambda function
> docker run -p 8080:8080 test

# make a http request to your function, passing event with the -d
> curl -XPOST "http://localhost:8080/2015-03-31/functions/function/invocations" -d '{}'
```

## Deploy to production

### Web

Just ship `packages/web` on Vercel. Define the .env file correctly.

### Lambda function

To use the workflow `cd-lambda-function`, you will need to complete the following set-up steps:

You need create the following AWS resources:
   - Lambda function defined as container image
   - API Gateway for trigger the lambda function
   - ECR repository with tag immutability disabled for store container images

1. Store an IAM user access key in GitHub Actions secrets named `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
   See the documentation for each action used below for the recommended IAM policies for this IAM user,
   and best practices on handling the access key credentials.

2. Create an ECR repository to store your docker images.
   For example: `aws ecr create-repository --repository-name my-ecr-repo --region us-east-1`.
   Replace the value of `AWS_ECR_REPOSITORY_NAME` env in the workflow below with your repository's name.
   Replace the value of `AWS_REGION` env in the workflow below with your repository's region.

3. Create lambda function and API Gateway for triggered it.
   Replace the value of `AWS_LAMBDA_FUNCTION_NAME` env in the workflow below with your function's name.


## Acknowledgements

To position each node of the tree on 2D plane in an aesthetically pleasing way, I implemented the Reingold-Tilford's algorithm. Thanks to:

- [Drawing Presentable Trees](https://llimllib.github.io/pymag-trees/#foot5)
- [Improving Walker's Algorithm to Run in Linear Time](http://dirk.jivas.de/papers/buchheim02improving.pdf)

## Compatibility

For a better experience I recommend running in a chromium-based browser, like  Chrome or Edge.

## Contact me

- [Twitter](https://twitter.com/brnpapa)

