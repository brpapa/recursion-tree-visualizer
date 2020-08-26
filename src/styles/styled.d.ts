import 'styled-components'
import type { Theme } from './themes'

// extende o pacote do styled components com a minha interface DefaultTheme
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
