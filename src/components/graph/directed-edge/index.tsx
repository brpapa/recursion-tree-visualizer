import React from 'react'
import { Group, Line, Circle, Text } from './styles'
import { pointOnLine, centralPoint } from './utils'
import { VERTEX_RADIUS } from './../constants'
import { Point } from '../../../types'

type Props = {
  start: Point
  end: Point
  label?: string
  visited?: boolean
}

const DirectedEdge = ({ start, end, label, visited = false }: Props) => {
  // renderiza uma aresta direcionada de P à Q
  const [P] = React.useState(() => pointOnLine(end, start, VERTEX_RADIUS))
  const [Q] = React.useState(() => pointOnLine(start, end, VERTEX_RADIUS + 10)) //! hardcode
  const [C] = React.useState(() => centralPoint(P, Q))

  return (
    <Group color={'black'}>
      {/* FIXME: defs é renderizado várias vezes desnecessariamente, teria outra forma de fazer a arrowhead? */}
      <defs>
        <marker
          id='marker-arrowhead'
          markerWidth='6'
          markerHeight='4'
          refX='5'
          refY='2'
          orient='auto'
          markerUnits='strokeWidth'
        >
          <path d='M 2,0 L 2,4 L 6,2 Z' />
        </marker>
      </defs>

      <Line
        x1={P[0]}
        y1={P[1]}
        x2={Q[0]}
        y2={Q[1]}
        markerEnd='url(#marker-arrowhead)'
      >
        <animate
          attributeName='x2'
          from={P[0]}
          to={Q[0]}
          dur='0.6s'
          repeatCount='1'
        />
        <animate
          attributeName='y2'
          from={P[1]}
          to={Q[1]}
          dur='0.6s'
          repeatCount='1'
        />
      </Line>

      {label !== undefined && (
        <>
          <Circle cx={C[0]} cy={C[1]} r={15} />
          <Text x={C[0]} y={C[1]}>
            {label}
          </Text>
        </>
      )}
    </Group>
  )
}

export default DirectedEdge
