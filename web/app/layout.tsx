import React from 'react'
import StyledJsxRegistry from './registry'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '../src/lib/google-analytics'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <title>Recursion Tree Visualizer</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='Input the source code of any recursive function in javascript, python or golang and visualize its recursion tree'
        />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
        />
        <FavIcon />
      </head>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
        <SpeedInsights />
        <GoogleAnalytics gaId='UA-172363386-2' />
      </body>
    </html>
  )
}

const FavIcon = () => (
  <>
    <meta name='msapplication-TileColor' content='#da532c' />
    <meta name='theme-color' content='#fff' />
    <link
      rel='apple-touch-icon'
      sizes='180x180'
      href='/icon/apple-touch-icon.png'
    />
    <link
      rel='icon'
      type='image/png'
      sizes='32x32'
      href='/icon/favicon-32x32.png'
    />
    <link
      rel='icon'
      type='image/png'
      sizes='16x16'
      href='/icon/favicon-16x16.png'
    />
    <link rel='manifest' href='/icon/site.webmanifest'></link>
  </>
)
