/**
 * Used for expected errors, that is, deterministic and meaningful errors that convey the business logic and domain. For unexpected errors, like network or file access failures, throw exceptions.
 */
export interface Error<T> {
  type: T
  reason: string
}

export enum ChildProcessError {
  CompilationError = 'CompilationError',
  RuntimeError = 'RuntimeError',
  TimeoutError = 'TimeoutError',
  ExceededRecursiveCallsLimit = 'ExceededRecursiveCallsLimit',
}

export enum TreeError {
  EmptyTree = 'EmptyTree',
}

export const emptyTreeError = (): Error<TreeError.EmptyTree> => ({
  type: TreeError.EmptyTree,
  reason: 'The recursion tree is empty',
})

export const runtimeError = (
  stderr: string
): Error<ChildProcessError.RuntimeError> => {
  // TODO: stderr provavelmente vai se diferenciar entre novas languages

  const messages = stderr.split('\n')
  console.log(messages)
  const local = messages.slice(1, 3)
  const message = messages[4]
  console.log('local: ', local)
  console.log('message: ', message)

  return {
    type: ChildProcessError.RuntimeError,
    reason: `The code outputs the following ${
      message.split(':')[0]
    }:${message.split(':').splice(1).join('')}`,
  }
}

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
