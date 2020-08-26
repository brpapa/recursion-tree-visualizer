import React from 'react'
import { Group, Circle, Text } from './styles'
import { Point } from '../../../types'

const Vertex: React.FC<{
  P: Point
  label: string
  radius: number
  foregroundColor?: string
  backgroundColor?: string
  visited?: boolean
}> = ({
  P,
  label,
  radius,
  foregroundColor = 'black',
  backgroundColor = 'white',
  visited = false
}) => {
  return (
    <Group
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
      visited={visited}
    >
      <Circle cx={P[0]} cy={P[1]} r={radius} />
      <Text x={P[0]} y={P[1]}>
        {label}
      </Text>
    </Group>
  )
}

export default Vertex
