import { Error } from './common'

export enum ChildProcessError {
  CompilationError = 'Compilation Error',
  RuntimeError = 'Runtime Error',
  TimeoutError = 'Timeout Error',
}

export const runtimeError = (
  stderr: string
): Error<ChildProcessError.RuntimeError> => {
  const rawMessages = stderr.split('\n').filter((m) => !!m)

  try {
    const rawMessage = rawMessages[3]
    const errorType = rawMessage.split(':')[0]
    const errorMessage = rawMessage.split(':').splice(1).join('')
    // const errorLocal = rawMessages.slice(1, 3)

    return {
      type: ChildProcessError.RuntimeError,
      reason: `Your code outputs the following ${errorType}: '${errorMessage}'`,
    }
  } catch {
    throw new Error(`Fail to parse the \`stderr\`:\n${stderr}`)
  }
}

export const timeoutError = (
  timeLimitMs: number
): Error<ChildProcessError.TimeoutError> => ({
  type: ChildProcessError.TimeoutError,
  reason: `The execution time limit of ${toSeconds(timeLimitMs)}s was exceeded`,
})

const toSeconds = (ms: number) => (ms / 1000).toFixed(2)
