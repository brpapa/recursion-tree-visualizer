import { ChildProcessError, TreeError } from '../../errors'
import { flow } from 'fp-ts/lib/function'
import getFullSourceCode from './full-source-code'
import generateRecursionTree from './recursion-tree'
import { SupportedLanguages } from '../../types'

/** Examples of the same array position are equivalents */
const examples = [
  {
    node: [
      'const arr = [1, 2, 3]',
      '',
      'function _fn(i, s) {',
      '  if (s == 0) return 1',
      '  if (i == arr.length || s < 0) return 0',
      '  return fn(i + 1, s) + fn(i + 1, s - arr[i])',
      '}',
      '',
      'const fnParamsValues = [0,7]',
      'const memoize = true',
    ].join('\n'),
    python: [
      'arr = [1, 2, 3]',
      '',
      'def _fn(i, s):',
      '    if (s == 0):',
      '        return 1',
      '    if (i == len(arr) or s < 0):',
      '        return 0',
      '    return fn(i + 1, s) + fn(i + 1, s - arr[i])',
      '',
      'fnParamsValues = [0, 7]',
      'memoize = False',
    ].join('\n'),
  },
  {
    node: [
      'function _fn() {',
      '  return fn()',
      '}',
      '',
      'const fnParamsValues = []',
      'const memoize = true',
    ].join('\n'),
    python: [
      'def _fn():',
      '  return fn()',
      '',
      'fnParamsValues = []',
      'memoize = True',
    ].join('\n'),
  },
  {
    node: [
      'function _fn() {',
      '  return notDefined()',
      '}',
      '',
      'const fnParamsValues = []',
      'const memoize = true',
    ].join('\n'),
    python: [
      'def _fn():',
      '  return notDefined()',
      '',
      'fnParamsValues = []',
      'memoize = True',
    ].join('\n'),
  },
  // fallback values
  {
    node: [
      'function _fn() {}',
      '',
      'const fnParamsValues = []',
      'const memoize = true',
    ].join('\n'),
    python: [
      'def _fn():',
      '  ',
      '',
      'fnParamsValues = []',
      'memoize = True',
    ].join('\n'),
  },
]

const recursionTreeBuilder = (lang: SupportedLanguages) =>
  flow(
    (plainCode: string) => getFullSourceCode(plainCode, lang),
    (fullSourceCode) => generateRecursionTree(fullSourceCode, lang)
  )

const buildRecursionTreeForNode = recursionTreeBuilder('node')
const buildRecursionTreeForPython = recursionTreeBuilder('python')

describe('Recursion tree from a plain code for `node` language', () => {
  describe('Should return valid sucess objects', () => {
    it('Example 0', async () => {
      const res = await buildRecursionTreeForNode(examples[0].node)
      expect(res.isSuccess()).toBeTruthy()
    })
  })

  describe('Should return valid error objects', () => {
    it('Example 1: exceeded recursive calls limit', async () => {
      const res = await buildRecursionTreeForNode(examples[1].node)
      expect(res.isError()).toBeTruthy()
      if (res.isError())
        expect(res.value.type).toEqual(
          ChildProcessError.ExceededRecursiveCallsLimit
        )
    })

    it('Example 2: runtime error', async () => {
      const res = await buildRecursionTreeForNode(examples[2].node)
      expect(res.isError()).toBeTruthy()
      if (res.isError())
        expect(res.value.type).toEqual(ChildProcessError.RuntimeError)
    })

    it('Example 3: empty tree', async () => {
      const res = await buildRecursionTreeForNode(examples[3].node)
      expect(res.isError()).toBeTruthy()
      if (res.isError()) expect(res.value.type).toEqual(TreeError.EmptyTree)
    })
  })
})

describe('Recursion tree from a plain code for `python` language', () => {
  describe('Should return valid success objects', () => {
    it('Example 0', async () => {
      const res = await buildRecursionTreeForPython(examples[0].python)
      expect(res.isSuccess()).toBeTruthy()
    })
  })

  describe('Should return valid error objects', () => {
    it('Example 1: exceeded recursive calls limit', async () => {
      const res = await buildRecursionTreeForPython(examples[1].python)
      expect(res.isError()).toBeTruthy()
      if (res.isError())
        expect(res.value.type).toEqual(
          ChildProcessError.ExceededRecursiveCallsLimit
        )
    })

    it('Example 2: runtime error', async () => {
      const res = await buildRecursionTreeForNode(examples[2].python)
      expect(res.isError()).toBeTruthy()
      if (res.isError())
        expect(res.value.type).toEqual(ChildProcessError.RuntimeError)
    })

    // TODO: terminar
    // it('Example 3: empty tree', async () => {
    //   const res = await buildRecursionTreeForNode(examples[3].python)
    //   expect(res.isError()).toBeTruthy()
    //   if (res.isError()) expect(res.value.type).toEqual(TreeError.EmptyTree)
    // })
  })
})


describe('For all supported languages', () => {
  describe('The result for equivalent user-defined code should be equals between all languages', () => {
    it('Example 0', async () => {
      const nodeRes = await buildRecursionTreeForNode(
        examples[0].node
      )
      const pythonRes = await buildRecursionTreeForPython(
        examples[0].python
      )
      expect(nodeRes).toEqual(pythonRes)
    })
  })
})
