// TODO: https://coolors.co/palettes/trending
// https://chakra-ui.com/theme
import { Themes } from './../types'

const common = {
  fonts: {
    body:
      "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
    mono: 'Menlo, monospace',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
}

const light = {
  ...common,
  colors: {
    contrast: '#000',
    backgroundAccent: '#e3e3e3',
    background: '#f5f5f5',
    foreground: '#fff',
    foregroundAccent: '#f8f8f8',
    border: '#ececec',
    borderAccent: 'rgb(60, 60, 60, 0.15)',
    text: '#111',
    textPlaceholder: '#aaa',
    primary: '#185EE0',
    error: '#e11d62',
  },
}

const dark = {
  ...common,
  colors: {
    contrast: '#fff',
    backgroundAccent: '#484a4d4f',
    background: '#151616',
    foreground: '#242526',
    foregroundAccent: '#383a3d',
    border: '#474a4d',
    borderAccent: '#505050',
    text: '#dadce1',
    textPlaceholder: '#aaa',
    primary: '#06d6a0',
    error: '#ef476f',
  },
}

export type Theme = typeof light
export default { light, dark } as Record<Themes, Theme>
