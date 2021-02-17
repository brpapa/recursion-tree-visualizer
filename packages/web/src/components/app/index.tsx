import React from 'react'
import { ThemeProvider } from 'styled-components'

import GlobalStyle from '../../styles/global'
import * as s from './styles'
import FunctionForm from '../function-form'
import TreeViewer from '../graph-viewer'
import Footer from './footer'
import themes from '../../styles/themes'
import { TreeViewerData, Themes, FunctionData } from '../../types'
import { safeParse } from '../../utils/safe-json'

const App = () => {
  const [themeName, setThemeName] = React.useState<Themes>('light')
  const [treeViewerData, setTreeViewerData] = React.useState<TreeViewerData>(
    null
  )

  // TODO: toast and loading
  const handleFunctionFormSubmit = async (
    functionData: FunctionData,
    options: { memoize: boolean; animate: boolean }
  ) => {
    try {
      const response = await fetch(
        'https://8j3kgh0303.execute-api.us-east-1.amazonaws.com/rtv-lambda',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            lang: 'node',
            functionData,
            options: { memoize: options.memoize },
          })
        }
      )
      const text = await response.text()
      const responseBody = safeParse(text) as TreeViewerData
      console.log(responseBody)
      setTreeViewerData(responseBody)
    } catch (e) {
      console.log(e)
      setTreeViewerData(null)
    }
  }

  return (
    <ThemeProvider theme={themes[themeName]}>
      <GlobalStyle />
      <s.AppContainer>
        <s.Sidebar>
          <FunctionForm
            onSubmit={handleFunctionFormSubmit}
            onThemeChange={setThemeName}
          />
        </s.Sidebar>
        <s.Main>
          <TreeViewer data={treeViewerData} options={{ animate: false }} />
          <Footer />
        </s.Main>
      </s.AppContainer>
    </ThemeProvider>
  )
}

export default App
