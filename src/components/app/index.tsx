import React from 'react'
import { ThemeProvider } from 'styled-components'

import GlobalStyle from './../../styles/global'
import * as s from './styles'
import FunctionForm from '../function-form'
import GraphViewer from '../graph-viewer'
import Footer from './footer'
import themes from './../../styles/themes'
import { AdjList, Args, Themes } from '../../types'

const App = () => {
  const [themeName, setThemeName] = React.useState<Themes>('light')

  const [adjList, setAdjList] = React.useState<AdjList>({})
  const [args, setArgs] = React.useState<Args>({})
  const [result, setResult] = React.useState(NaN)

  return (
    <ThemeProvider theme={themes[themeName]}>
      <GlobalStyle />
      <s.App>
        <s.Sidebar>
          <FunctionForm
            onSubmit={(adjList, args, result) => {
              setAdjList(adjList)
              setArgs(args)
              setResult(result)
            }}
            onThemeChange={(themeName) => {
              setThemeName(themeName)
            }}
          />
        </s.Sidebar>
        <s.Main>
          <GraphViewer adjList={adjList} args={args} result={result} />
          <Footer link='https://github.com/brpapa/recursion-tree-visualizer' />
        </s.Main>
      </s.App>
    </ThemeProvider>
  )
}

export default App
