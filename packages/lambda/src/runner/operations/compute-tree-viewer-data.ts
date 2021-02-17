import { RecursionTree } from "../../types"
import computeRawCoords from "./compute-raw-coords"
import traverseTree from "./traverse-tree"

export default function computeTreeViewerData(tree: RecursionTree) {
  const { rawCoords, rawBottomRight } = computeRawCoords(tree.vertices)
  const treeViewerData = traverseTree(tree, rawCoords, rawBottomRight)
  return treeViewerData
}
