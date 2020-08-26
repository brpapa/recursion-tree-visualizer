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
    text: '#000',
    textPlaceholder: '#aaa',
    primary: '#185EE0',
  },
}
/*
export const dark = {
  ...base,
  border: '1px solid #474a4d',
  colors: {
    background: '#151616',
    foreground: '#242526',
    foregroundHover: '#484a4d4f',
    foregroundAccent: '#484a4d',
    foregroundAccentHover: '#505050',
    text: '#dadce1',
  },
}
*/

export type Theme = typeof light
