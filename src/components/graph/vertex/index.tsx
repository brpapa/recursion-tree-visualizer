import React from 'react'
import { Group, Circle, Text } from './styles'
import { VERTEX_RADIUS } from './../constants'
import { Point } from '../../../types'

type Props = {
  center: Point
  label: string
  visited?: boolean
}

const Vertex = ({ center: P, label, visited = false }: Props) => {
  const textRef = React.useRef<SVGTextElement>(null)

  // scale down the <text> element with css transform, if need
  React.useLayoutEffect(() => {
    const { current } = textRef
    if (!current || !label) return

    // FIXME
    // const { width, height } = current.getBBox()
    // const width = current.getComputedTextLength()
    const width = label.length * 6
    const height = 12

    let scale = Math.min(15 / width, 15 / height)
    scale = Math.min(scale, 1)

    current.style.transform = `scale(${scale})`
    current.style.transformOrigin = 'center'
    current.style.transformBox = 'fill-box'

    // return () => {
    //   if (current) current.style.transform = `scale(1)`
    // }
  }, [label])

  return (
    <Group {...{ backgroundColor: 'white', foregroundColor: 'black', visited }}>
      <Circle cx={P[0]} cy={P[1]} r={VERTEX_RADIUS} />
      <Text x={P[0]} y={P[1]} ref={textRef}>
        {label}
      </Text>
    </Group>
  )
}

export default Vertex
