'use client'
import React, { useState } from 'react'
import App from '../src/components/app'
import { ThemeProvider } from 'styled-components'
import themes, { ThemeName } from '../src/styles/themes'
import GlobalStyle from '../src/styles/global'
import { DEFAULT_THEME_TYPE } from '../src/config/consts'
import { Toaster } from 'react-hot-toast'

export default function Page() {
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME_TYPE)
  const theme = themes[themeName]

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Toaster
        position='top-left'
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: theme.colors.foreground,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.contrast,
            boxShadow: 'none',
          },
        }}
      />
      <App onThemeChange={setThemeName} />
    </ThemeProvider>
  )
}
