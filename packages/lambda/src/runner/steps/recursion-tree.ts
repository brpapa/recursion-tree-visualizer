import childProcess from 'child_process'
import util from 'util'
import { RecursionTree, SupportedLanguages } from '../../types'
import { Either, error, success } from '../../utils/either'
import { Error } from '../../errors/common'
import {
  ChildProcessError,
  runtimeError,
  timeoutError,
} from '../../errors/child-process'
import {
  TreeError,
  emptyTreeError,
  exceededRecursiveCallsLimitError,
} from '../../errors/tree'
import debug from 'debug'
import { validateChildProcessStdout } from '../../validations/stdout'

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
      | TreeError.ExceededRecursiveCallsLimit
      | TreeError.EmptyTree
    >,
    RecursionTree
  >
> {
  const declare = buildDeclare(lang)

  try {
    const { stdout: rawStdout } = await exec(
      declare.command(sourceCode), 
      { timeout: CHILD_PROCESS_TIMEOUT_MS }
    ) // throws exceptions if not output a stdout
    // log(rawStdout)

    const validatedStdout = validateChildProcessStdout(rawStdout)
    if (validatedStdout.isError())
      throw new Error(`Fail to deserialize the \`rawStdout\` object:\n${validatedStdout.value}`)

    const stdout = validatedStdout.value
    if (stdout.errorValue !== null)
      return error(
        exceededRecursiveCallsLimitError(stdout.errorValue)
      )

    const recursionTree = stdout.successValue!

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
