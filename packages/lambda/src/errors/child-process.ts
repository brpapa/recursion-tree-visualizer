import { Error } from './common'

export enum ChildProcessError {
  CompilationError = 'Compilation Error',
  RuntimeError = 'Runtime Error',
  TimeoutError = 'Timeout Error',
}

export const runtimeError = (
  stderr: string
): Error<ChildProcessError.RuntimeError> => {
  // console.log({ stderr })

  const matched = stderr.match(/([a-zA-Z]*(Error|Exception):\s[^\n]+)/gm)
  if (matched === null) throw new Error(`Fail to parse the following stderr:\n${stderr}`)

  const errorMessage = matched[0]

  return {
    type: ChildProcessError.RuntimeError,
    reason: `Your code outputs the following ${errorMessage}`,
  }
}

export const timeoutError = (
  timeLimitMs: number
): Error<ChildProcessError.TimeoutError> => ({
  type: ChildProcessError.TimeoutError,
  reason: `The execution time limit of ${toSeconds(timeLimitMs)}s was exceeded`,
})

const toSeconds = (ms: number) => (ms / 1000).toFixed(2)
