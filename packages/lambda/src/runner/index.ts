import { flow } from 'fp-ts/function'
import getFullSourceCode from './steps/full-source-code'
import generateRecursionTree from './steps/recursion-tree'
import translateToPlainCode from './steps/plain-code'
import computeTreeViewerData from './steps/tree-viewer-data'
import { FunctionData, SupportedLanguages } from '../types'

/** Input FuncionData, output the TreeViewerData. */
export default function buildRunner(
  lang: SupportedLanguages,
  options: { memoize: boolean }
) {
  return flow(
    (fnData: FunctionData) => translateToPlainCode(fnData, lang, options),
    (plainCode) => getFullSourceCode(plainCode, lang),
    (sourceCode) => generateRecursionTree(sourceCode, lang),
    async (treeOrError) => (await treeOrError).onSuccess(computeTreeViewerData)
  )
}
