'use client'
import { useContext, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ThemeContext } from 'styled-components'
import { ThemeName } from '../../styles/themes'
import { FunctionData, Language, TreeViewerData } from '../../types'
import FunctionForm from '../function-form'
import GraphViewer from '../graph-viewer'
import { fetchTreeViewerData } from './../../config/api'
import Footer from './footer'
import styled from 'styled-components'

const App = (props: { onThemeChange: (themeName: ThemeName) => void }) => {
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
    <AppContainer>
      <Sidebar>
        <FunctionForm
          onSubmit={handleFunctionFormSubmit}
          onThemeChange={props.onThemeChange}
        />
      </Sidebar>
      <Main>
        <GraphViewer
          isLoading={isLoading}
          data={treeViewerData}
          options={treeViewerOptions}
        />
        <Footer />
      </Main>
    </AppContainer>
  )
}

export default App

export const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;

  flex-direction: column;
  ${({ theme }) => theme.devices.desktop} {
    flex-direction: row;
  }
`
export const Sidebar = styled.div`
  height: 100vh;

  width: 100%;
  ${({ theme }) => theme.devices.desktop} {
    width: 390px;
  }
`
export const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0.8em;
  height: 100vh;
`