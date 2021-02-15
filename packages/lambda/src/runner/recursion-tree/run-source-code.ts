import childProcess from 'child_process'
import util from 'util'
import {
  RecursionTree,
  SourceCodeOutput,
  SupportedLanguages,
} from '../../types'
import { Either, error, success } from '../../utils/either'
import {
  Error,
  ChildProcessError as ChildProcessError,
  exceededRecursiveCallsLimitError,
  runtimeError,
  timeoutError,
  TreeError,
  emptyTreeError,
} from '../../errors'
import { languageConfigs } from './language-configs'
import debug from 'debug'

const log = debug('runner:recursion-tree')

const CHILD_PROCESS_TIMEOUT_MS = 500

const exec = util.promisify(childProcess.exec)

/** Starts a child process that compile and run the source code content and return your output. */
export default async function runSourceCode(
  content: string,
  lang: SupportedLanguages
): Promise<
  Either<
    Error<
      | ChildProcessError.RuntimeError
      | ChildProcessError.CompilationError
      | ChildProcessError.TimeoutError
      | ChildProcessError.ExceededRecursiveCallsLimit
      | TreeError.EmptyTree
    >,
    RecursionTree
  >
> {
  const { command } = languageConfigs(content)[lang]

  try {
    const processReturn = await exec(command, {
      timeout: CHILD_PROCESS_TIMEOUT_MS,
    })
    const output = JSON.parse(processReturn.stdout) as SourceCodeOutput

    if (output.errorValue !== null)
      return error(exceededRecursiveCallsLimitError(output.errorValue))

    const recursionTree = output.successValue!

    if (
      Object.keys(recursionTree.vertices).length === 0 ||
      recursionTree.vertices[0].adjList.length === 0
    )
      return error(emptyTreeError())

    return success(recursionTree)
  } catch (err) {
    if (err.killed) return error(timeoutError(CHILD_PROCESS_TIMEOUT_MS))

    // TODO: messages é diferente entre node, python e possivelmente cpp
    const messages = err.stderr.split('\n') as string[]
    const local = messages.slice(1, 3).join('\n')
    const message = messages[4]
    log(messages)
    log('local: ', local)
    log('message: ', message)
    return error(runtimeError(message))
  }
}
