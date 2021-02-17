import debug from 'debug'
import { flow } from 'fp-ts/function'
import getFullSourceCode from './operations/get-full-source-code'
import generateRecursionTree from './operations/generate-recursion-tree'
import computeRawCoords from './operations/compute-raw-coords'
import traverseTree from './operations/traverse-tree'
import translateToPlainCode from './operations/translate-to-plain-code'
import { FunctionData, RecursionTree, SupportedLanguages } from '../types'

const log = debug('handler:runner')

/** Input FuncionData, output the TreeViewerData. */
export default function buildRunner(lang: SupportedLanguages, options?: any) {
  return flow(
    (fnData: FunctionData) => translateToPlainCode(fnData, lang, options),
    (plainCode) => getFullSourceCode(plainCode, lang),
    (sourceCode) => generateRecursionTree(sourceCode, lang),
    async (treeOrError) => (await treeOrError).onSuccess(computeTreeViewerData)
  )
}

export const computeTreeViewerData = (tree: RecursionTree) => {
  const { rawCoords, rawBottomRight } = computeRawCoords(tree.vertices)
  const treeViewerData = traverseTree(tree, rawCoords, rawBottomRight)
  return treeViewerData
}
