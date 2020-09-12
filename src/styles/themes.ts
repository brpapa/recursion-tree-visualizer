// TODO: https://coolors.co/palettes/trending

const base = {
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  }
}

export const light = {
  ...base,
  border: '1px solid rgb(120, 120, 120, 0.15)',
  borderAccent: '1px solid rgb(120, 120, 120, 0.25)',
  colors: {
    background: '#f8f8f8',
    foreground: '#fff',
    foregroundHover: '#e3e3e33f',
    foregroundAccent: '#e3e3e3',
    contrast: '#000',
    textPlaceholder: '#aaa',
    primary: '#185EE0',
    error: '#e11d62',
  },
}

export const dark = {
  ...base,
  border: '1px solid #474a4d',
  borderAccent: '1px solid #505050',
  colors: {
    background: '#151616',
    foreground: '#242526',
    foregroundHover: '#484a4d4f',
    foregroundAccent: '#484a4d',
    contrast: '#fff',
    text: '#dadce1',
    textPlaceholder: '#aaa',
    primary: '#9bf6ff',
    error: '#ffadad',
  },
}

export type Theme = typeof light
