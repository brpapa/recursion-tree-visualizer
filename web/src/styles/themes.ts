export type ThemeName = 'light' | 'dark'

const common = {
  fonts: {
    body: "'Inter', -apple-system, system-ui, 'Helvetica Neue', sans-serif",
    mono: "'Menlo', 'SF Mono', monospace",
  },
  devices: {
    desktop: '@media only screen and (min-width: 666px)',
  },
}

const light = {
  ...common,
  type: 'light' as ThemeName,
  colors: {
    contrast: '#000',
    background: '#f0f0f0',
    backgroundAccent: '#e3e3e3',
    foreground: '#fff',
    foregroundAccent: '#fcfcfc',
    border: '#ececec',
    borderAccent: 'rgb(207, 207, 207)',
    text: '#111',
    textPlaceholder: '#aaa',
    primary: '#185EE0',
    error: '#e11d62',
  },
}

const dark = {
  ...common,
  type: 'dark' as ThemeName,
  colors: {
    contrast: '#fff',
    background: '#151616',
    backgroundAccent: '#484a4d4f',
    foreground: '#242526',
    foregroundAccent: '#2A2B2C',
    border: '#474a4d',
    borderAccent: '#747474',
    text: '#dadce1',
    textPlaceholder: '#aaa',
    primary: '#0093FA',
    error: '#ef476f',
  },
}

export type Theme = typeof light
export default { light, dark } as Record<ThemeName, Theme>
