<div align="center">
  <img src="./assets/logo.svg" height="100"/>
</div>

<h1 align="center">Recursion Tree Visualizer</h1>

<p align="center">🥇 Winner project of the <a href="https://www.algoexpert.io/swe-project-contests/2020-summer">AlgoExpert SWE Project Contest</a> 🥇</p>

## Overview

Stop drawing recursion trees by hand. Watch the [demo video](https://youtu.be/1f-KeeN8AHs) or check out the [live project](https://recursion.now.sh).

### Folders structure

- `packages/web`: web user interface. Deployed on Vercel. Built with React, Styled Components and PrismJS.
- `packages/lambda`: API for the remote code runner. Deployed on AWS ECS. Built with Node.

## How to use locally 

In the `packages/web` directory, run:

```bash
# to install all dependencies
> npm install

# to run the app on http://localhost:3000
> npm run start
```

### With Docker (dev)

In the root directory, run:

```bash
# to run all containers
> docker-compose -f docker-compose.dev.yml up

# to stop and remove containers, networks, images and volumes
> docker-compose -f docker-compose.dev.yml down
```

### With Docker (prod)

In the root directory, run:

```bash
# to create and run all containers after rebuild images
> docker-compose -f docker-compose.yml up --build

# to stop and remove containers, networks, images and volumes
> docker-compose -f docker-compose.yml down
```

## Deploying `server`

### Push a new docker image to the AWS ECR repository

I'll assume that the AWS ECR repository was defined with the name `recursion-tree-visualizer`.

In the root directory:

```bash
# Retrieve an authentication token and authenticate your Docker client to AWS ECR
> aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com

# Build the docker image
> docker build --tag recursion-tree-visualizer --target prod ./packages/lambda

# Tag the docker image to the `recursion-tree-visualizer` ECR repository
> docker tag recursion-tree-visualizer:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/recursion-tree-visualizer:latest

# Push the image to ECR repository
> docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/recursion-tree-visualizer:latest
```

### Update image in ECS

If your task is running under a service you can force a new deployment. This forces the task definition to be re-evaluated and the new container image to be pulled.

```bash
aws ecs update-service --cluster <cluster name> --service <service name> --force-new-deployment
```

## Deploying `web`

Just ship `packages/web` on Vercel.

## Acknowledgements

To position each node of the tree on 2D plane in an aesthetically pleasing way, I implemented the Reingold-Tilford's algorithm. Thanks to:

- [Drawing Presentable Trees](https://llimllib.github.io/pymag-trees/#foot5)
- [Improving Walker's Algorithm to Run in Linear Time](http://dirk.jivas.de/papers/buchheim02improving.pdf)

## Compatibility

For a better experience I recommend running in a chromium-based browser, like  Chrome or Edge.

## Contact me

- [Twitter](https://twitter.com/brnpapa)

