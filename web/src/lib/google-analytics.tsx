'use client'
import React, { useEffect } from 'react'
import Script from 'next/script'

type GAParams = {
  gaId: string
  dataLayerName?: string
  debugMode?: boolean
  nonce?: string
}

declare global {
  interface Window {
    dataLayer?: Object[]
    [key: string]: any
  }
}

let currDataLayerName: string | undefined = undefined

export function GoogleAnalytics(props: GAParams) {
  const { gaId, debugMode, dataLayerName = 'dataLayer', nonce } = props

  if (currDataLayerName === undefined) {
    currDataLayerName = dataLayerName
  }

  return (
    <>
      <Script
        id='_next-ga-init'
        dangerouslySetInnerHTML={{
          __html: `
          window['${dataLayerName}'] = window['${dataLayerName}'] || [];
          function gtag() { window['${dataLayerName}'].push(arguments); }
          gtag('js', new Date());

          gtag('config', '${gaId}' ${
            debugMode ? ",{ 'debug_mode': true }" : ''
          });`,
        }}
        nonce={nonce}
      />
      <Script
        id='_next-ga'
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        nonce={nonce}
      />
    </>
  )
}

export function sendGAEvent(..._args: Object[]) {
  if (currDataLayerName === undefined) {
    console.warn(`@next/third-parties: GA has not been initialized`)
    return
  }

  if (window[currDataLayerName]) {
    window[currDataLayerName].push(arguments)
  } else {
    console.warn(
      `@next/third-parties: GA dataLayer ${currDataLayerName} does not exist`
    )
  }
}