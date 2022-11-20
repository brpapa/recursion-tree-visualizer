import { flow } from 'fp-ts/function'
import { toFullSourceCode } from './steps/source-code'
import { toRecursionTree } from './steps/recursion-tree'
import { toUserCode } from './steps/user-code'
import { toTreeViewer } from './steps/tree-viewer'
import { FunctionData, SupportedLanguages } from '../types'
import { DEFAULT_MAX_RECURSIVE_CALLS, DEFAULT_TIMEOUT_MS } from '../config'
import { toRawTree } from './steps/raw-tree'

/** Pipeline to input FuncionData and output TreeViewerData. */
export default function buildRunner(
  lang: SupportedLanguages,
  options?: {
    memoize?: boolean
    timeoutMs?: number
    maxRecursiveCalls?: number
  }
) {
  const memoize = options?.memoize || false
  const timeoutMs = options?.timeoutMs || DEFAULT_TIMEOUT_MS
  const maxRecursiveCalls =
    options?.maxRecursiveCalls || DEFAULT_MAX_RECURSIVE_CALLS

  return flow(
    (fnData: FunctionData) => toUserCode(fnData, lang, memoize),
    (userCode) => toFullSourceCode(userCode, lang, maxRecursiveCalls),
    (fullSourceCode) => toRecursionTree(fullSourceCode, lang, timeoutMs),
    (recursionTree) => recursionTree.then((r) => r.onSuccess(toRawTree)),
    (rawTree) => rawTree.then((r) => r.onSuccess(toTreeViewer))
  )
}
