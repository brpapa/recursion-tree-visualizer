/**
 * Used for expected errors, that is, deterministic and meaningful errors that convey the business logic and domain. For unexpected errors, like network or file access failures, throw exceptions.
 */
export interface Error<T> {
  type: T
  reason: string
}

export enum ChildProcessError {
  CompilationError,
  RuntimeError,
  TimeoutError,
  ExceededRecursiveCallsLimit,
}

export enum TreeError {
  EmptyTree,
}

export const emptyTreeError = (): Error<TreeError.EmptyTree> => ({
  type: TreeError.EmptyTree,
  reason: 'The recursion tree is empty',
})

export const runtimeError = (
  msg: string
): Error<ChildProcessError.RuntimeError> => ({
  type: ChildProcessError.RuntimeError,
  reason: `${msg}`,
})

export const timeoutError = (
  timeLimitMs: number
): Error<ChildProcessError.TimeoutError> => ({
  type: ChildProcessError.TimeoutError,
  reason: `The execution time limit of ${toSeconds(timeLimitMs)}s was exceeded`,
})

export const exceededRecursiveCallsLimitError = (
  recursiveCallsLimit: number
): Error<ChildProcessError.ExceededRecursiveCallsLimit> => ({
  type: ChildProcessError.ExceededRecursiveCallsLimit,
  reason: `The limit of ${recursiveCallsLimit} recursive calls was exceeded`,
})

const toSeconds = (ms: number) => (ms / 1000).toFixed(2)
