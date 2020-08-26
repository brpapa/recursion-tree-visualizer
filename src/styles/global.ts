import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  #root {
    font-family: 'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
    font-size: 15px;
  }

  *,
  *:after,
  *:before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`
