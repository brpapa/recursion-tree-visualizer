import { flow } from 'fp-ts/function'
import getSourceCode from './steps/source-code'
import generateRecursionTree from './steps/recursion-tree'
import translateToPlainCode from './steps/plain-code'
import computeTreeViewerData from './steps/tree-viewer-data'
import { FunctionData, SupportedLanguages } from '../types'

const DEFAULT_TIMEOUT_MS = 5000
const DEFAULT_MAX_RECURSIVE_CALLS = 256

/** Pipeline to input FuncionData and output TreeViewerData. */
export default function buildRunner(
  lang: SupportedLanguages,
  options: { memoize: boolean, timeoutMs?: number, maxRecursiveCalls?: number }
) {
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS
  const maxRecursiveCalls = options.maxRecursiveCalls || DEFAULT_MAX_RECURSIVE_CALLS

  return flow(
    (fnData: FunctionData) => translateToPlainCode(fnData, lang, options),
    (plainCode) => getSourceCode(plainCode, lang, maxRecursiveCalls),
    (sourceCode) => generateRecursionTree(sourceCode, lang, timeoutMs),
    async (tree) => (await tree).onSuccess(computeTreeViewerData)
  )
}
