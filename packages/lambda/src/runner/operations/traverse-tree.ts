import { objectMap } from '../../utils/object-map'
import {
  Point,
  VerticesData,
  EdgesData,
  TreeViewerData,
  RecursionTree,
  Vertices,
} from '../../types'

/** Traverse tree to adjust coords, populate logs, times, verticesData and edgesData */
export default function traverseTree(
  tree: RecursionTree,
  rawCoords: Record<number, Point>,
  rawBottomRight: Point
): TreeViewerData {
  const logs: string[] = []
  const edgesData = initialEdgesData(tree.vertices)
  const verticesData = initialVerticesData(rawCoords, tree.vertices)
  const seen: boolean[] = []
  let time = 0

  ;(function eulerTour(parentId: number = 0) {
    if (verticesData[parentId] === undefined) return
    seen[parentId] = true

    // parentId
    verticesData[parentId].times.push(time++)
    logs.push(`running fn(${verticesData[parentId].label})`)

    // para cada aresta parentId -w-> childId
    for (const { childId: childId } of tree.vertices[parentId]?.adjList || []) {
      if (!seen[childId]) {
        // parentId -> childId
        edgesData[edgeKey(parentId, childId)].timeRange[0] = time++
        logs.push(
          `fn(${verticesData[parentId].label}) calls fn(${verticesData[childId].label})`
        )

        eulerTour(childId)

        // childId -> parentId
        edgesData[edgeKey(parentId, childId)].timeRange[1] = time - 1
        edgesData[edgeKey(childId, parentId)].timeRange[0] = time++
        logs.push(
          `fn(${verticesData[childId].label}) returns ${
            edgesData[edgeKey(childId, parentId)].label
          } to fn(${verticesData[parentId].label})`
        )

        // parentId
        verticesData[parentId].times.push(time++)
        logs.push(`continues by running fn(${verticesData[parentId].label})`)
      }
    }
  })()

  logs.push(
    `fn(${verticesData[0].label}) returns ${edgeCostLabel(tree.fnResult)}`
  )

  return {
    verticesData: verticesData,
    edgesData: edgesData,
    svgBottomRight: coord(rawBottomRight, true),
    times: time,
    logs,
  }
}

const initialVerticesData = (
  rawCoords: Record<number, Point>,
  vertices: Vertices
): VerticesData => {
  return objectMap(rawCoords, (c, key) => {
    const v = Number(key)

    return {
      times: [],
      coord: coord(c),
      label: verticeArgsLabel(vertices[v]?.argsList) || `${v}`,
      memoized: vertices[v]?.memoized || false,
    }
  })
}

const initialEdgesData = (vertices: Vertices): EdgesData => {
  return Object.keys(vertices).reduce<EdgesData>((acc, key) => {
    const parentId = Number(key)

    // para cada aresta parentId -weight-> childId
    for (const { childId, weight } of vertices[parentId].adjList) {
      acc[edgeKey(parentId, childId)] = {
        timeRange: [-Infinity, Infinity],
      }
      acc[edgeKey(childId, parentId)] = {
        label: edgeCostLabel(weight),
        timeRange: [-Infinity, Infinity],
      }
    }
    return acc
  }, {})
}


/* helpers */

const edgeKey = (u: number, v: number) => JSON.stringify([u, v])

const MAX_NUMBER = 1e5

const edgeCostLabel = (w?: number) => {
  if (w === undefined) return undefined
  if (w === Infinity) return '∞'
  if (w === -Infinity) return '-∞'
  return w > MAX_NUMBER ? w.toExponential(2) : w.toString()
}

const verticeArgsLabel = (verticeArgs?: any[]) => {
  if (verticeArgs === undefined) return undefined
  return verticeArgs
    .map((arg) => (arg > MAX_NUMBER ? arg.toExponential(2) : arg.toString()))
    .join(',')
}

const TRANSLATED_BY: Point = [50, 50]
const SCALED_BY: Point = [85, 150]

const coord = (rawCoord: Point, isBottomRight = false): Point => [
  rawCoord[0] * SCALED_BY[0] + (isBottomRight ? 2 : 1) * TRANSLATED_BY[0],
  rawCoord[1] * SCALED_BY[1] + (isBottomRight ? 2 : 1) * TRANSLATED_BY[1],
]
