import React from 'react'
import { ThemeProvider } from 'styled-components'

import GlobalStyle from './../../styles/global'
import { AppContainer, Layout, Footer } from './styles'
import FunctionForm from '../function-form'
import GraphViewer from '../graph-viewer'
import { light, dark } from './../../styles/themes'
import { AdjList, Args } from '../../types'

// const fakeAdjList: AdjList = {
//   0: [{ v: 1 }, { v: 7 }, { v: 8 }, { v: 2 }, { v: 3 }],
//   1: [{ v: 4 }],
//   2: [{ v: 5 }],
//   3: [{ v: 6 }],
//   4: [{ v: 13 }, { v: 14 }, { v: 15 }],
//   5: [{ v: 16 }, { v: 17 }, { v: 18 }],
//   6: [{ v: 19 }, { v: 20 }, { v: 21 }],
// }

const App = () => {
  const [adjList, setAdjList] = React.useState<AdjList>({})
  const [args, setArgs] = React.useState<Args>({})
  const [result, setResult] = React.useState<number>(NaN)

  return (
    <ThemeProvider theme={light}>
      <GlobalStyle />
      <AppContainer>
        <Layout>
          <FunctionForm
            onSubmit={(adjList, args, result) => {
              setResult(result)
              setAdjList(adjList)
              setArgs(args)
            }}
          />
          <GraphViewer adjList={adjList} args={args} result={result} />
        </Layout>
        <Footer>
          Made with ❤️ by Bruno Papa{'  '}•{'  '}
          <a href='https://github.com/brpapa/recursion-tree-visualizer' target='__blank'>
            Github
          </a>
        </Footer>
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
