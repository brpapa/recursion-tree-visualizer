'use client'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import runFunction from '../../action/run-function'
import { ThemeName } from '../../styles/themes'
import { FunctionData, Language, TreeViewerData } from '../../types'
import FunctionForm from '../function-form'
import GraphViewer from '../graph-viewer'
import Footer from './footer'

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

    try {
      const result = await runFunction({
        lang,
        functionData,
        options: { memoize: options.memoize },
      })

      if (result.ok) {
        setTreeViewerData(result.value)
        setTreeViewerOptions({ animate: options.animate })
      } else {
        toast.error(result.value)
        setTreeViewerData(null)
      }
    } catch (e) {
      console.error(e)
      toast.error('Internal error')
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
