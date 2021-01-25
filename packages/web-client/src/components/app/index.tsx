import React from 'react'
import { ThemeProvider } from 'styled-components'

import GlobalStyle from './../../styles/global'
import * as s from './styles'
import FunctionForm from '../function-form'
import GraphViewer from '../graph-viewer'
import Footer from './footer'
import themes from './../../styles/themes'
import { GraphData, Themes } from '../../types'

const App = () => {
  const [themeName, setThemeName] = React.useState<Themes>('light')
  const [graphData, setGraphData] = React.useState<GraphData>(null)

  return (
    <ThemeProvider theme={themes[themeName]}>
      <GlobalStyle />
      <s.AppContainer>
        <s.Sidebar>
          <FunctionForm onSubmit={setGraphData} onThemeChange={setThemeName} />
        </s.Sidebar>
        <s.Main>
          <GraphViewer graphData={graphData} />
          <Footer />
        </s.Main>
      </s.AppContainer>
    </ThemeProvider>
  )
}

export default App
