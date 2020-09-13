import React from 'react'

// scale down the <text> svg element with css transform, if need
const useScaleDown = (
  textRef: React.RefObject<SVGTextElement>,
  textInnerHtml?: string
) => {
  React.useLayoutEffect(() => {
    const { current } = textRef
    if (!current || !textInnerHtml) return

    // FIXME: está dependente da font-size do <text>
    // const { width, height } = current.getBBox()
    // const width = current.getComputedTextLength()
    const width = textInnerHtml.length * 6
    const height = 12

    const scale = Math.min(15 / width, 15 / height)

    current.style.transform = `scale(${Math.min(scale, 1)})`
    current.style.transformOrigin = 'center'
    current.style.transformBox = 'fill-box'
  }, [textInnerHtml, textRef])
}

export default useScaleDown