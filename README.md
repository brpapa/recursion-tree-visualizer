<div align="center">
  <img src="./assets/logo.svg" height="100"/>
</div>

<h1 align="center">Recursion Tree Visualizer</h1>

<p align="center">🥇 Winner project of the <a href="https://www.algoexpert.io/swe-project-contests/2020-summer">AlgoExpert SWE Project Contest</a> 🥇</p>

## Overview

Stop drawing recursion trees by hand. Watch the [demo video](https://youtu.be/1f-KeeN8AHs) or check out the [live project](https://recursion.now.sh).

### Folders structure

- `web`: react user interface.
- `lambda`: serverless lambda function to execute user-defined code remotely.

## Local development

### Web

In the `web` directory, run:

```bash
# to install all dependencies
$ npm install

# to run the app on http://localhost:3003
$ npm run start
```

### Lambda

You can use the Amazon Runtime Interface Emulator (RIE), already contained in the docker image, to test the Lambda function.

In the `lambda` directory, run:

```bash
# build your local image
$ docker build --tag rtv .

# create and run a container using AWS RIE as executable to emulate a server for your lambda function
$ docker run --rm -p 8080:8080 rtv

# make a http request to your function, passing event with the -d in body field (escaped json), see examples in requests.http file
$ curl -XPOST "http://localhost:8080/2015-03-31/functions/function/invocations" -d '{"body":"{}"}'
```

## Deploy to production

### Lambda

In `terraform` folder:

- create terraform.tfvars file
- run `terraform init`
- run `terraform validate`
- run `terraform plan`
- run `terraform apply`

### Web

Ships `web` on Vercel, setup environment variables.

## Acknowledgements

Thanks to [Drawing Presentable Trees](https://llimllib.github.io/pymag-trees/#foot5) and [Improving Walker's Algorithm to Run in Linear Time](http://dirk.jivas.de/papers/buchheim02improving.pdf) articles I implemented Reingold-Tilford's algorithm to position each node of the tree on a 2D plane in an aesthetically pleasing way.

## Compatibility

For a better experience, I recommend using a chromium-based browser like Chrome or Edge.

## Contact me

- [Twitter](https://twitter.com/brnpapa)

