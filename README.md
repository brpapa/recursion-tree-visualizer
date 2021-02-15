<div align="center">
  <img src="./assets/logo.svg" height="100"/>
</div>

<h1 align="center">Recursion Tree Visualizer</h1>

<p align="center">🥇 Winner project of the <a href="https://www.algoexpert.io/swe-project-contests/2020-summer">AlgoExpert SWE Project Contest</a> 🥇</p>

## Overview

Stop drawing recursion trees by hand. Watch the [demo video](https://youtu.be/1f-KeeN8AHs) or check out the [live project](https://recursion.now.sh).

### Folders structure

- `packages/web`: web user interface. Deployed on Vercel. Built with React, Styled Components and PrismJS.
- `packages/lambda`: a lambda function for the remote code runner and computation. Deployed on AWS Lambda as a container. Built with Node.

## Development 

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

Use the Amazon Runtime Interface Emulator (RIE), already contained in the image, to test the lambda function locally:

```bash
> docker build --tag test:latest . 
> docker run -p 8080:8080 test:latest 
> curl -XPOST "http://localhost:8080/2015-03-31/functions/function/invocations" -d '{}'
```


## Deploy to production

### Web

Just ship `packages/web` on Vercel.

### Lambda function


## Acknowledgements

To position each node of the tree on 2D plane in an aesthetically pleasing way, I implemented the Reingold-Tilford's algorithm. Thanks to:

- [Drawing Presentable Trees](https://llimllib.github.io/pymag-trees/#foot5)
- [Improving Walker's Algorithm to Run in Linear Time](http://dirk.jivas.de/papers/buchheim02improving.pdf)

## Compatibility

For a better experience I recommend running in a chromium-based browser, like  Chrome or Edge.

## Contact me

- [Twitter](https://twitter.com/brnpapa)

