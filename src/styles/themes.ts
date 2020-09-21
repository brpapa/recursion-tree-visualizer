// TODO: https://coolors.co/palettes/trending
// https://chakra-ui.com/theme
import { Themes } from './../types'

const common = {
  fonts: {
    body:
      "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
    mono: 'Menlo, monospace',
  },
  // breakpoints: {
  //   sm: '576px',
  //   md: '768px',
  //   lg: '992px',
  //   xl: '1200px',
  // },
  devices: {
    // mobile-first
    desktop: '@media only screen and (min-width: 666px)',
  },
}

const light = {
  ...common,
  name: 'light',
  colors: {
    contrast: '#000',
    backgroundAccent: '#e3e3e3',
    background: '#f0f0f0',
    foreground: '#fff',
    foregroundAccent: '#fcfcfc',
    border: '#ececec',
    borderAccent: 'rgb(215, 215, 215)',
    text: '#111',
    textPlaceholder: '#aaa',
    primary: '#185EE0',
    error: '#e11d62',
  },
}

const dark = {
  ...common,
  name: 'dark',
  colors: {
    contrast: '#fff',
    backgroundAccent: '#484a4d4f',
    background: '#151616',
    foreground: '#242526',
    foregroundAccent: '#383a3d',
    border: '#474a4d',
    borderAccent: '#707070',
    text: '#dadce1',
    textPlaceholder: '#aaa',
    primary: '#0093FA',
    error: '#ef476f',
  },
}

export type Theme = typeof light
export default { light, dark } as Record<Themes, Theme>
