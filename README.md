<div align="center">
  <img src="./assets/logo.svg" height="100"/>
</div>

<h1 align="center">Recursion Tree Visualizer</h1>

<p align="center">🥇 One of the winners of the <a href="https://www.algoexpert.io/swe-project-contests/2020-summer">AlgoExpert SWE Project Contest</a> 🥇</p>

## Overview

Stop drawing recursion trees by hand. View the [demo video](https://youtu.be/1f-KeeN8AHs). Check out the [live project](https://recursion.now.sh).

### Folders structure

- `packages/web-client`: front-end code deployed on Vercel. Built with React, Styled Components and PrismJS.
<!-- - `packages/node-server`: server for analyse js code -->

## How to use

In the `packages/web-client` directory, run:

```bash
# Install all dependencies
> npm install

# Run the app on http://localhost:3000
> npm run start
```

## Acknowledgements

To positionate each node of the tree on 2D plane in an aesthetically pleasing way, I implemented the Reingold-Tilford's algorithm. Thanks to:

- [Drawing Presentable Trees](https://llimllib.github.io/pymag-trees/#foot5)
- [Improving Walker's Algorithm to Run in Linear Time](http://dirk.jivas.de/papers/buchheim02improving.pdf)

## Contact

- Github [@brpapa](https://github.com/brpapa)
- Twitter [@brnpapa](https://twitter.com/brnpapa)
