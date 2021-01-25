import { FunctionData, GraphData } from '../types'
import getGraphData from './get-graph-data'
import getTree from './get-tree'

type Options = {
  memorize: boolean
  animate: boolean
}

export default function (fnData: FunctionData, options: Options): GraphData {
  const { adjList, args, result, memoVertices } = getTree(
    fnData,
    options.memorize
  )

  if (Object.keys(adjList).length === 0 || result === null) return null

  return {
    ...getGraphData(adjList, args, result, memoVertices),
    options: {
      animate: options.animate,
    },
  }
}
