import childProcess from 'child_process'
import util from 'util'
import fs from 'fs'
import crypto from 'crypto'
import {
  ChildProcessError,
  runtimeError,
  timeoutError,
} from '../../errors/child-process'
import { Error } from '../../errors/common'
import {
  emptyTreeError,
  exceededRecursiveCallsLimitError,
  exceededSourceCodeSizeLimitError,
  TreeError,
} from '../../errors/tree'
import { InitialTree, SupportedLanguages } from '../../types'
import { Either, error, success } from '../../utils/either'
import { validateChildProcessStdout } from '../../validations/stdout'

const exec = util.promisify(childProcess.exec)

const ENCODING: BufferEncoding = 'utf-8'

/** Starts a child process that evaluate the source code content and return the recursion tree. */
export async function toInitialTree(
  sourceCode: string,
  lang: SupportedLanguages,
  childProcessTimeoutMs: number,
  tmpFolderPath: string,
  tmpFileMaxSizeBytes: number
): Promise<
  Either<
    Error<
      | ChildProcessError.RuntimeError
      | ChildProcessError.CompilationError
      | ChildProcessError.TimeoutError
      | TreeError.EmptyTree
      | TreeError.ExceededRecursiveCallsLimit
      | TreeError.ExceededSourceCodeSizeLimit
    >,
    InitialTree
  >
> {
  const declare = buildDeclare(lang)

  // validar tamanho do arquivo a partir do source code
  const bytes = Buffer.byteLength(sourceCode, ENCODING)
  if (bytes >= tmpFileMaxSizeBytes) {
    return error(exceededSourceCodeSizeLimitError(tmpFileMaxSizeBytes))
  }

  // criar folder se ela ainda nao existe
  try {
    if (!fs.existsSync(tmpFolderPath))
      fs.mkdirSync(tmpFolderPath, { recursive: true })
  } catch (err) {
    console.log(err)
    throw err
  }

  const tmpFileName = `${crypto
    .randomBytes(16)
    .toString('hex')}.${declare.ext()}`
  const tmpFileFullPath = `${tmpFolderPath}/${tmpFileName}`

  // escrever código fonte
  try {
    fs.writeFileSync(tmpFileFullPath, sourceCode, {
      encoding: ENCODING,
      flag: 'w+',
    })
  } catch (err) {
    console.log(err)
    throw err
  }

  // compilar/executar programa

  try {
    // `exec` throws exceptions if not outputs a stdout
    const { stdout: rawStdout } = await exec(declare.command(tmpFileFullPath), {
      timeout: childProcessTimeoutMs,
    })

    const stdout = validateChildProcessStdout(rawStdout)
    if (stdout.errorValue !== null)
      return error(exceededRecursiveCallsLimitError(stdout.errorValue))

    const recursionTree = stdout.successValue!

    const recursionTreeIsEmpty =
      Object.keys(recursionTree.vertices).length === 0 ||
      recursionTree.vertices[0].adjList.length === 0

    if (recursionTreeIsEmpty)
      return error(emptyTreeError())

    return success(recursionTree)
  } catch (err) {
    if (err?.killed) return error(timeoutError(childProcessTimeoutMs))
    if (err?.stderr) return error(runtimeError(lang, err.stderr as string))
    throw err
  } finally {
    fs.rmSync(tmpFileFullPath)
  }
}

const buildDeclare = (lang: SupportedLanguages) => ({
  command: (path: string) => {
    switch (lang) {
      case 'node':
        return `node "${path}"`
      case 'python':
        return `python3 "${path}"`
      case 'golang':
        return `go run "${path}"`
      default:
        throw new Error(`Unexpected lang, got ${lang}`)
    }
  },
  ext: () => {
    switch (lang) {
      case 'node':
        return 'js'
      case 'python':
        return 'py'
      case 'golang':
        return 'go'
      default:
        throw new Error(`Unexpected lang, got ${lang}`)
    }
  },
})
