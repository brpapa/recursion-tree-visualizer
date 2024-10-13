import { useEffect, useRef } from 'react'
import './carbon-ads.css'

export function CarbonAds() {
  const divRefAds = useCarbonAds()

  return <div ref={divRefAds} />
}

// retorna uma ref para o nó do dom <div><script .../><div id='carbonads'/></div>
function useCarbonAds() {
  const adsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const divEl = adsRef?.current
    if (divEl === null) return

    const scriptEl = document.createElement('script')
    scriptEl.type = 'text/javascript'
    scriptEl.async = true
    scriptEl.src =
      '//cdn.carbonads.com/carbon.js?serve=CKYIC27J&placement=pathfindingnowsh'
    scriptEl.id = '_carbonads_js'

    divEl.appendChild(scriptEl)
    return () => {
      divEl.removeChild(scriptEl)
    }
  }, [])

  return adsRef
}
