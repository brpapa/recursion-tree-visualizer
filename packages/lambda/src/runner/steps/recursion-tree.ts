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
import debug from 'debug'
import { safeParse } from '../../utils/safe-json'

const log = debug('app:runner:recursion-tree')
const exec = util.promisify(childProcess.exec)

const CHILD_PROCESS_TIMEOUT_MS = 5000

/** Starts a child process that evaluate the source code content and return the recursion tree. */
export default async function generateRecursionTree(
  sourceCode: string,
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
  const declare = buildDeclare(lang)

  try {
    const { stdout } = await exec(declare.command(sourceCode), {
      timeout: CHILD_PROCESS_TIMEOUT_MS,
    })
    const output = safeParse(stdout) as SourceCodeOutput

    if (output.errorValue !== null)
      return error(exceededRecursiveCallsLimitError(output.errorValue))

    const recursionTree = output.successValue!

    const recursionTreeIsEmpty =
      Object.keys(recursionTree.vertices).length === 0 ||
      recursionTree.vertices[0].adjList.length === 0

    if (recursionTreeIsEmpty) return error(emptyTreeError())

    return success(recursionTree)
  } catch (err) {
    if (err?.killed) return error(timeoutError(CHILD_PROCESS_TIMEOUT_MS))
    if (err?.stderr) return error(runtimeError(err.stderr as string))
    throw err
  }
}

const buildDeclare = (lang: SupportedLanguages) => ({
  command: (sourceCode: string) => {
    if (lang === 'node') return `node -e "${sourceCode}"`
    if (lang === 'python') return `python3 -c "${sourceCode}"`
    return ''
  },
})
