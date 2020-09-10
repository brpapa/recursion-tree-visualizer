import getCoords from './get-coords'
import { objectMap, labeledEdgeCost, labeledVerticeArgs } from './utils'
import { Point, VerticesData, EdgesData, AdjList, Args } from '../../types'

const TRANSLATED_BY: Point = [50, 50]
const SCALED_BY: Point = [85, 150]

export default function getGraphData(adjList: AdjList, args: Args, rootId = 0) {
  const { rawCoords, rawBottomRight } = getCoords(adjList)

  // initialize

  const verticesData: VerticesData = objectMap(rawCoords, (c, key) => {
    const v = Number(key)
    return {
      times: [],
      coord: [
        c[0] * SCALED_BY[0] + TRANSLATED_BY[0],
        c[1] * SCALED_BY[1] + TRANSLATED_BY[1],
      ],
      label: labeledVerticeArgs(args[v]) || `${v}`,
    }
  })
  const edgesData = Object.keys(adjList).reduce<EdgesData>((acc, key) => {
    const u = Number(key)
    // para cada aresta u -w-> v
    for (const { v, w } of adjList[u]) {
      acc[JSON.stringify([u, v])] = {
        timeRange: [-Infinity, Infinity],
      }
      acc[JSON.stringify([v, u])] = {
        label: labeledEdgeCost(w),
        timeRange: [-Infinity, Infinity],
      }
    }
    return acc
  }, {})
  const svgBottomRight: Point = [
    rawBottomRight[0] * SCALED_BY[0] + 2 * TRANSLATED_BY[0],
    rawBottomRight[1] * SCALED_BY[1] + 2 * TRANSLATED_BY[1],
  ]

  // calculate times em verticesData e edgesData
  const seen: boolean[] = []
  let time = 0
  eulerTour(rootId)

  return { verticesData, edgesData, svgBottomRight, qtyTimes: time }

  /* */

  function eulerTour(u: number) {
    seen[u] = true

    verticesData[u]?.times.push(time++)

    // para cada aresta u -w-> v
    for (const { v } of adjList[u] || []) {
      if (!seen[v]) {
        edgesData[JSON.stringify([u, v])].timeRange[0] = time++

        eulerTour(v)

        edgesData[JSON.stringify([u, v])].timeRange[1] = time - 1
        edgesData[JSON.stringify([v, u])].timeRange[0] = time++
        verticesData[u]?.times.push(time++)
      }
    }
  }
}
