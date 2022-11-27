import React, { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'styled-components'
import { DEFAULT_THEME_TYPE } from '../../config/consts'
import GlobalStyle from '../../styles/global'
import { default as theme, default as themes } from '../../styles/themes'
import { FunctionData, Language, ThemeType, TreeViewerData } from '../../types'
import FunctionForm from '../function-form'
import TreeViewer from '../graph-viewer'
import { fetchTreeViewerData } from './../../config/api'
import Footer from './footer'
import * as s from './styles'

const App = () => {
  const [themeType, setThemeName] = useState<ThemeType>(DEFAULT_THEME_TYPE)
  const [treeViewerData, setTreeViewerData] = useState<TreeViewerData>(null)
  const [treeViewerOptions, setTreeViewerOptions] = useState({ animate: false })
  const [isLoading, setIsLoading] = useState(false)

  const handleFunctionFormSubmit = async (
    lang: Language,
    functionData: FunctionData,
    options: { memoize: boolean; animate: boolean }
  ) => {
    setIsLoading(true)

    const result = await fetchTreeViewerData({
      lang,
      functionData,
      options: { memoize: options.memoize },
    })

    if (result.isSuccess()) {
      setTreeViewerData(result.value)
      setTreeViewerOptions({ animate: options.animate })
    } else if (result.isError()) {
      toast.error(result.value)
      setTreeViewerData(null)
    }

    setIsLoading(false)
  }

  return (
    <ThemeProvider theme={themes[themeType]}>
      <GlobalStyle />
      <Toaster
        position='top-left'
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: theme[themeType].colors.foreground,
            border: `1px solid ${theme[themeType].colors.border}`,
            color: theme[themeType].colors.contrast,
            boxShadow: 'none',
          },
        }}
      />
      <s.AppContainer>
        <s.Sidebar>
          <FunctionForm
            onSubmit={handleFunctionFormSubmit}
            onThemeChange={setThemeName}
          />
        </s.Sidebar>
        <s.Main>
          <TreeViewer
            isLoading={isLoading}
            data={treeViewerData}
            options={treeViewerOptions}
          />
          <Footer />
        </s.Main>
      </s.AppContainer>
    </ThemeProvider>
  )
}

export default App
