import { SupportedLanguages } from '../types'
import { Error } from './common'

export enum ChildProcessError {
  CompilationError = 'Compilation Error',
  RuntimeError = 'Runtime Error',
  TimeoutError = 'Timeout Error',
}

export const runtimeError = (
  lang: SupportedLanguages,
  stderr: string
): Error<ChildProcessError.RuntimeError> => {
  
  const errorMessage = ((): string => {
    if (lang === 'python' || lang === 'node') {
      const matched1st = /([a-zA-Z]*(Error|Exception):\s[^\n]+)/gm.exec(stderr)
      if (matched1st !== null && matched1st?.length >= 1)
        return matched1st[1]
    }
    if (lang === 'golang') {
      const matched2nd = /panic:\s([^\n]+)/gm.exec(stderr)
      if (matched2nd !== null && matched2nd.length >= 1)
        return `Error: ${matched2nd[1]}`

      const matched3rd = /# command-line-arguments\n.*.go:\d+:\d+:\s([^\n]+)/gm.exec(stderr)
      if (matched3rd !== null && matched3rd.length >= 1)
        return `Error: ${matched3rd[1]}`
    }
    throw new Error(`Fail to parse the stderr:\n${stderr}`)
  })()

  return {
    type: ChildProcessError.RuntimeError,
    reason: `Your code outputs the ${errorMessage}`,
  }
}

export const timeoutError = (
  timeLimitMs: number
): Error<ChildProcessError.TimeoutError> => ({
  type: ChildProcessError.TimeoutError,
  reason: `The execution time limit of ${toSeconds(timeLimitMs)}s was exceeded`,
})

const toSeconds = (ms: number) => (ms / 1000).toFixed(2)
