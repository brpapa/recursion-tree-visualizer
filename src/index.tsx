import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider } from 'styled-components'

import App from './components/app'
import GlobalStyle from './styles/global'
import { light } from './styles/themes'

const Root = () => {
  return (
    <ThemeProvider theme={light}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  )
}

render(<Root />, document.getElementById('root'))
