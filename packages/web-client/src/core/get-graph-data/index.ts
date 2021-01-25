import getCoords from './get-coords'
import { objectMap, labeledEdgeCost, labeledVerticeArgs } from './utils'
import { Point, VerticesData, EdgesData, AdjList, Args } from '../../types'

const TRANSLATED_BY: Point = [50, 50]
const SCALED_BY: Point = [85, 150]

export default function getGraphData(
  adjList: AdjList,
  args: Args,
  result: number,
  memoVertices: number[],
  rootId = 0
) {
  if (Object.keys(adjList).length === 0)
    throw new Error('The adjList argument should not be empty')

  const { rawCoords, rawBottomRight } = getCoords(adjList)

  // initializes
  const logs: string[] = [] // logs[time]: text
  const edgesData = initialEdgesData(adjList)
  const verticesData = initialVerticesData(rawCoords, args, memoVertices)
  const svgBottomRight: Point = [
    rawBottomRight[0] * SCALED_BY[0] + 2 * TRANSLATED_BY[0],
    rawBottomRight[1] * SCALED_BY[1] + 2 * TRANSLATED_BY[1],
  ]

  /** */
  const seen: boolean[] = []
  let time = 0
  eulerTour(rootId) // mutate time, logs, verticesData, edgesData
  logs.push(
    `fn(${verticesData[0].label}) returns ${labeledEdgeCost(result)}`
  )

  return { verticesData, edgesData, svgBottomRight, times: time, logs }

  function eulerTour(u: number) {
    if (verticesData[u] === undefined) return
    seen[u] = true

    // u
    verticesData[u].times.push(time++)
    logs.push(`running fn(${verticesData[u].label})`)

    // para cada aresta u -w-> v
    for (const { v } of adjList[u] || []) {
      if (!seen[v]) {
        // u -> v
        edgesData[edgeKey(u, v)].timeRange[0] = time++
        logs.push(
          `fn(${verticesData[u].label}) calls fn(${verticesData[v].label})`
        )

        eulerTour(v)

        // v -> u
        edgesData[edgeKey(u, v)].timeRange[1] = time - 1
        edgesData[edgeKey(v, u)].timeRange[0] = time++
        logs.push(
          `fn(${verticesData[v].label}) returns ${
            edgesData[edgeKey(v, u)].label
          } to fn(${verticesData[u].label})`
        )

        // u
        verticesData[u].times.push(time++)
        logs.push(`continues by running fn(${verticesData[u].label})`)
      }
    }
  }
}

const edgeKey = (u: number, v: number) => JSON.stringify([u, v])

const initialVerticesData = (
  rawCoords: Record<number, Point>,
  args: Args,
  memoVertices: number[]
): VerticesData => {
  return objectMap(rawCoords, (c, key) => {
    const v = Number(key)

    return {
      times: [],
      coord: [
        c[0] * SCALED_BY[0] + TRANSLATED_BY[0],
        c[1] * SCALED_BY[1] + TRANSLATED_BY[1],
      ],
      label: labeledVerticeArgs(args[v]) || `${v}`,
      memorized: memoVertices.find((vert) => vert === v) !== undefined
    }
  })
}

const initialEdgesData = (adjList: AdjList): EdgesData => {
  return Object.keys(adjList).reduce<EdgesData>((acc, key) => {
    const u = Number(key)

    // para cada aresta u -w-> v
    for (const { v, w } of adjList[u]) {
      acc[edgeKey(u, v)] = {
        timeRange: [-Infinity, Infinity],
      }
      acc[edgeKey(v, u)] = {
        label: labeledEdgeCost(w),
        timeRange: [-Infinity, Infinity],
      }
    }
    return acc
  }, {})
}
