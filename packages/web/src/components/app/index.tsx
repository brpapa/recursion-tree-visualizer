import React from 'react'
import { ThemeProvider } from 'styled-components'

import GlobalStyle from '../../styles/global'
import * as s from './styles'
import FunctionForm from '../function-form'
import TreeViewer from '../graph-viewer'
import Footer from './footer'
import themes from '../../styles/themes'
import { TreeViewerData, Themes } from '../../types'

const App = () => {
  const [themeName, setThemeName] = React.useState<Themes>('light')
  const [treeViewerData, setTreeViewerData] = React.useState<TreeViewerData>(null)

  return (
    <ThemeProvider theme={themes[themeName]}>
      <GlobalStyle />
      <s.AppContainer>
        <s.Sidebar>
          <FunctionForm onSubmit={setTreeViewerData} onThemeChange={setThemeName} />
        </s.Sidebar>
        <s.Main>
          <TreeViewer treeViewerData={treeViewerData} />
          <Footer />
        </s.Main>
      </s.AppContainer>
    </ThemeProvider>
  )
}

export default App
