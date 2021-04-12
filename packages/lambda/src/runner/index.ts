import { flow } from 'fp-ts/function'
import getSourceCode from './steps/source-code'
import generateRecursionTree from './steps/recursion-tree'
import translateToPlainCode from './steps/plain-code'
import computeTreeViewerData from './steps/tree-viewer-data'
import { FunctionData, SupportedLanguages } from '../types'

/** Pipeline to input FuncionData and output TreeViewerData. */
export default function buildRunner(
  lang: SupportedLanguages,
  options: { memoize: boolean }
) {
  return flow(
    (fnData: FunctionData) => translateToPlainCode(fnData, lang, options),
    (plainCode) => getSourceCode(plainCode, lang),
    (sourceCode) => generateRecursionTree(sourceCode, lang),
    async (tree) => (await tree).onSuccess(computeTreeViewerData)
  )
}
