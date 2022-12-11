import { flow } from 'fp-ts/function'
import { toSourceCode } from './steps/source-code'
import { toInitialTree } from './steps/initial-tree'
import { toFinalTree } from './steps/final-tree'
import { FunctionData } from './../static/types'
import { SupportedLanguages } from '../types'
import {
  DEFAULT_MAX_RECURSIVE_CALLS,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_TMP_DIR_PATH,
  DEFAULT_TMP_FILE_MAX_SIZE_BYTES,
} from '../config'
import { toIntermediateTree } from './steps/intermediate-tree'

/** Pipeline to input FuncionData and output TreeViewerData. */
export default function buildRunner(
  lang: SupportedLanguages,
  options?: {
    memoize?: boolean
    timeoutMs?: number
    maxRecursiveCalls?: number
    tmpDirPath?: string
    tmpFileMaxSizeBytes?: number
  }
) {
  const memoize = options?.memoize || false
  const timeoutMs = options?.timeoutMs || DEFAULT_TIMEOUT_MS
  const maxRecursiveCalls =
    options?.maxRecursiveCalls || DEFAULT_MAX_RECURSIVE_CALLS
  const tmpDirPath = options?.tmpDirPath || DEFAULT_TMP_DIR_PATH
  const tmpFileMaxSizeBytes =
    options?.tmpFileMaxSizeBytes || DEFAULT_TMP_FILE_MAX_SIZE_BYTES

  return flow(
    (fnData: FunctionData) =>
      toSourceCode(fnData, lang, maxRecursiveCalls, memoize),
    (sourceCode) =>
      toInitialTree(
        sourceCode,
        lang,
        timeoutMs,
        tmpDirPath,
        tmpFileMaxSizeBytes
      ),
    (tree) => tree.then((t) => t.onSuccess(toIntermediateTree)),
    (tree) => tree.then((t) => t.onSuccess(toFinalTree))
  )
}
