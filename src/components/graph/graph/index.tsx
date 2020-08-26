import React from 'react'

import { Svg } from './styles'
import DirectedEdge from '../directed-edge'
import Vertex from '../vertex'
import { computeCoords } from '../../../core/compute-coords'
import { Point, AdjList, EdgeList } from '../../../types'

const VERTEX_RADIUS = 35

type Props = {
  adjList: AdjList
  labels?: string[] // labels[u]: string label of vertex u
}

const Graph = (props: Props) => {
  const [edgeList, setEdgeList] = React.useState<EdgeList>([])
  const [verticesCoords, setVerticesCoords] = React.useState<Point[]>([])
  const [bottomRight, setBottomRight] = React.useState<Point>([0, 0])

  React.useEffect(() => {
    setEdgeList(() => {
      const res = []
      for (let u = 0; u < props.adjList.length; u++)
        for (let { v, w } of props.adjList[u]) res.push({ u, v, w })
      return res
    })

    const { rawCoords, rawBottomRight } = computeCoords(props.adjList, 0)
    setVerticesCoords(() =>
      rawCoords.map((coord) => [coord[0] * 90 + 50, coord[1] * 150 + 50])
    )
    setBottomRight(() => [
      rawBottomRight[0] * 90 + 100,
      rawBottomRight[1] * 150 + 100,
    ])
  }, [props.adjList])

  return (
    <Svg viewBox={`0 0 ${bottomRight[0]} ${bottomRight[1]}`}>
      {edgeList.map(
        (edge, e) =>
          verticesCoords[edge.u] &&
          verticesCoords[edge.v] && (
            <DirectedEdge
              key={e}
              P={verticesCoords[edge.u] as Point}
              Q={verticesCoords[edge.v] as Point}
              d={VERTEX_RADIUS}
              label={edge.w}
              // visited
            />
          )
      )}
      {verticesCoords.map(
        (coord, v) =>
          coord && (
            <Vertex
              key={v}
              P={coord}
              label={props.labels ? props.labels[v] : `${v}`}
              radius={VERTEX_RADIUS}
              // visited
            />
          )
      )}
    </Svg>
  )
}

export default Graph
