import React, { useState } from 'react'

import { Svg } from './styles'
import DirectedEdge from './directed-edge'
import Vertex from './vertex'
import { computeCoords } from '../../core/compute-coords'
import { objectMap } from './../../utils'
import { Point, AdjList, EdgeList } from '../../types'

type Props = {
  adjList: AdjList
  labels: Record<number, string> // labels[u]: string label of vertex u
}

const Graph = ({ adjList, labels }: Props) => {
  const [edgeList, setEdgeList] = useState<EdgeList>([])
  const [verticesCoord, setVerticesCoord] = useState<Record<number, Point>>({})
  const [bottomRight, setBottomRight] = useState<Point>([0, 0])

  // se labels for undefined, esse effect é disparado infinitamente. mas WHY?
  React.useEffect(() => {
    console.log('Re-computing the coords')
    const { rawCoords, rawBottomRight } = computeCoords(adjList)

    setEdgeList(() =>
      Object.keys(adjList).reduce<EdgeList>((acc, key) => {
        const u = Number(key)
        return [...acc, ...adjList[u].map(({ v, w }) => ({ u, v, w }))]
      }, [])
    )

    setVerticesCoord(() =>
      objectMap(rawCoords, (c) => [c[0] * 90 + 50, c[1] * 150 + 50])
    )

    setBottomRight(() => [
      rawBottomRight[0] * 90 + 100,
      rawBottomRight[1] * 150 + 100,
    ])
  }, [adjList, labels])

  return (
    <Svg viewBox={`0 0 ${bottomRight[0]} ${bottomRight[1]}`}>
      {edgeList.map(
        (edge, e) =>
          verticesCoord[edge.u] &&
          verticesCoord[edge.v] && (
            <DirectedEdge
              key={e}
              start={verticesCoord[edge.u]}
              end={verticesCoord[edge.v]}
              label={labeled(edge.w)}
              // visited
            />
          )
      )}
      {Object.entries(verticesCoord).map(([v, coord]) => (
        <Vertex
          key={v}
          center={coord}
          label={labels[Number(v)] || `${v}`}
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
