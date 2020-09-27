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
  const [animate, setAnimate] = React.useState(true)
  const [memoVertices, setMemoVertices] = React.useState<number[]>([])

  return (
    <ThemeProvider theme={themes[themeName]}>
      <GlobalStyle />
      <s.AppContainer>
        <s.Sidebar>
          <FunctionForm
            onSubmit={(adjList, args, result, animate, memoVertices) => {
              setAdjList(adjList)
              setArgs(args)
              setResult(result)
              setAnimate(animate)
              setMemoVertices(memoVertices)
            }}
            onThemeChange={(themeName) => {
              setThemeName(themeName)
            }}
          />
        </s.Sidebar>
        <s.Main>
          <GraphViewer {...{ adjList, args, result, animate, memoVertices }}/>
          <Footer/>
        </s.Main>
      </s.AppContainer>
    </ThemeProvider>
  )
}

export default App
