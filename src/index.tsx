import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider } from 'styled-components'

import Layout from './components/app'
import GlobalStyle from './styles/global'
import { light } from './styles/themes'

const App = () => {
  return (
    <ThemeProvider theme={light}>
      <GlobalStyle />
      <Layout />
    </ThemeProvider>
  )
}

render(<App />, document.getElementById('root'))
