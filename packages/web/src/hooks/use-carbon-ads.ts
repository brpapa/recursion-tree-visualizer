import { useEffect, useRef } from 'react'

// retorna uma ref para o nó do dom <div><script .../><div id='carbonads'/></div>
export default function useCarbonAds() {
  const adsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const divEl = adsRef?.current
    if (divEl === null) return

    const scriptEl = document.createElement('script')
    scriptEl.type = 'text/javascript'
    scriptEl.async = true
    scriptEl.src = '//cdn.carbonads.com/carbon.js?serve=CKYIC27J&placement=pathfindingnowsh'
    scriptEl.id = '_carbonads_js'

    divEl.appendChild(scriptEl)
    return () => {
      divEl.removeChild(scriptEl)
    }
  }, [])

  return adsRef
}
