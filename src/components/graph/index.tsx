import React from 'react'

import { Svg } from './styles'
import DirectedEdge from './directed-edge'
import Vertex from './vertex'
import { computeCoords } from '../../core/compute-coords'
import { Point, AdjList, EdgeList } from '../../types'

type Props = {
  adjList: AdjList
  labels?: string[] // labels[u]: string label of vertex u
}

const Graph = ({ adjList, labels }: Props) => {
  const [edgeList, setEdgeList] = React.useState<EdgeList>([])
  const [verticesCoord, setVerticesCoord] = React.useState<Point[]>([])
  const [bottomRight, setBottomRight] = React.useState<Point>([0, 0])

  React.useEffect(() => {
    setEdgeList(() => {
      const res = []
      for (let u = 0; u < adjList.length; u++)
        for (let { v, w } of adjList[u]) res.push({ u, v, w })
      return res
    })

    const { rawCoords, rawBottomRight } = computeCoords(adjList)

    setVerticesCoord(() =>
      rawCoords.map((coord) => [coord[0] * 90 + 50, coord[1] * 150 + 50])
    )
    setBottomRight(() => [
      rawBottomRight[0] * 90 + 100,
      rawBottomRight[1] * 150 + 100,
    ])
  }, [adjList, labels])

  return (
    <Svg viewBox={`0 0 ${bottomRight[0]} ${bottomRight[1]}`}>
      {edgeList.map((edge, e) => (
        <DirectedEdge
          key={e}
          start={verticesCoord[edge.u]}
          end={verticesCoord[edge.v]}
          label={labeled(edge.w)}
          // visited
        />
      ))}
      {verticesCoord.map((coord, v) => (
        <Vertex
          key={v}
          center={coord}
          label={labels ? labels[v] : `${v}`}
          // visited
        />
      ))}
    </Svg>
  )
}

const labeled = (n?: number) => {
  if (n === undefined) return undefined
  if (n === Infinity) return '∞'
  if (n === -Infinity) return '-∞'
  return n.toString()
}

export default Graph