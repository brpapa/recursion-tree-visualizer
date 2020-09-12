import 'styled-components'
import type { Theme } from './themes'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
