<div align="center">
  <img src="./assets/logo.svg" height="100"/>
</div>

<h1 align="center">Recursion Tree Visualizer</h1>

<p align="center">🥇 Winner project of the <a href="https://www.algoexpert.io/swe-project-contests/2020-summer">AlgoExpert SWE Project Contest</a> 🥇</p>

## Overview

Stop drawing recursion trees by hand. Watch the [demo video](https://youtu.be/1f-KeeN8AHs) or check out the [live project](https://recursion.now.sh).

### Folders structure

- `packages/web`: react user interface.
- `packages/lambda`: serverless lambda function to execute user-defined code remotely.
<!-- - `packages/common`: shared code between web and lambda -->

## Local development

### Web

In the `packages/web` directory, run:

```bash
# to install all dependencies
> npm install

# to run the app on http://localhost:3000
> npm run start
```

### Lambda

You can use the Amazon Runtime Interface Emulator (RIE), already contained in the docker image, to test the Lambda function.

In the `packages/lambda` directory, run:

```bash
# build your local image
> docker build --tag dev-image .

# create and run a container using AWS RIE as executable to emulate a server for your lambda function
> docker run --rm -p 8080:8080 dev-image

# make a http request to your function, passing event with the -d in body field (escaped json)
> curl -XPOST "http://localhost:8080/2015-03-31/functions/function/invocations" -d '{"body":"{}"}'
```

## Deploy to production

### Web

Set your lambda API endpoint in `packages/web/src/config/api.ts`.

Ships `packages/web` on Vercel.

### Lambda

The deployment of the Lambda function is automatized by the workflow `cd-lambda-function`. You will need to complete the following set-up steps to use it:

1. Create the following **AWS resources**:

   - Lambda function defined as a container image

   - API Gateway to trigger the lambda function with CORS support

   - ECR repository to store your Docker images

2. Store an IAM user access key in GitHub Actions secrets named `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

3. Change the workflow file `github/workflows/cd-lambda-function.yml`:

   - Replace the value of the `AWS_REGION` env with the region of all your AWS resources.

   - Replace the value of the `AWS_ECR_REPOSITORY_NAME` env with your repository's name.

   - Replace the value of the `AWS_LAMBDA_FUNCTION_NAME` env with your function's name.


## Acknowledgements

To position each node of the tree on a 2D plane in an aesthetically pleasing way, I implemented Reingold-Tilford's algorithm. Thanks to:

- [Drawing Presentable Trees](https://llimllib.github.io/pymag-trees/#foot5)
- [Improving Walker's Algorithm to Run in Linear Time](http://dirk.jivas.de/papers/buchheim02improving.pdf)

## Compatibility

For a better experience, I recommend using a chromium-based browser like Chrome or Edge.

## Contact me

- [Twitter](https://twitter.com/brnpapa)

