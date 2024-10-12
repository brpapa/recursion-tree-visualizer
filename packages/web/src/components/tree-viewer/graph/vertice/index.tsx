import React from 'react'
import { Container, Circle, Text } from './styles'
import { VERTEX_RADIUS } from '../constants'
import useScaleDown from '../../../../hooks/use-scale-down'
import { Point } from '../../../../types'

type Props = {
  center: Point
  label?: string
  highlight: 'current' | 'memoized' | 'none'
}

const Vertice = ({ center, label, highlight }: Props) => {
  const textRef = React.useRef<SVGTextElement>(null)
  useScaleDown(textRef, label)

  return (
    <Container highlight={highlight}>
      <Circle cx={center[0]} cy={center[1]} r={VERTEX_RADIUS} />
      <Text x={center[0]} y={center[1]} ref={textRef}>
        {label}
      </Text>
    </Container>
  )
}

export default Vertice
