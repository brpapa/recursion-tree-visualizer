import { flow } from 'fp-ts/function'
import getFullSourceCode from './operations/get-full-source-code'
import generateRecursionTree from './operations/generate-recursion-tree'
import translateToPlainCode from './operations/translate-to-plain-code'
import computeTreeViewerData from './operations/compute-tree-viewer-data'
import { FunctionData, SupportedLanguages } from '../types'

/** Input FuncionData, output the TreeViewerData. */
export default function buildRunner(lang: SupportedLanguages, options?: any) {
  return flow(
    (fnData: FunctionData) => translateToPlainCode(fnData, lang, options),
    (plainCode) => getFullSourceCode(plainCode, lang),
    (sourceCode) => generateRecursionTree(sourceCode, lang),
    async (treeOrError) => (await treeOrError).onSuccess(computeTreeViewerData)
  )
}