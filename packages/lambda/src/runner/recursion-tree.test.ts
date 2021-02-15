import { ChildProcessError, TreeError } from '../errors'
import RunnerFacade from '.'

// const fnData: FunctionData = {
//   variables: [{ name: 'arr', value: '[1,3,4,5,2,10]' }],
//   params: [
//     { name: 'i', value: '0' },
//     { name: 's', value: '7' },
//   ],
//   body: codefy([
//     'if (s == 0) return 1',
//     'if (i == arr.length || s < 0) return 0',
//     '',
//     'return fn(i+1, s) + fn(i+1, s-arr[i])',
//   ]),
// }

/** Examples of the same array position are equivalents */
const userDefinedCodeExamples = [
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
    python: '',
  },
  {
    node: [
      'function _fn() {}',
      '',
      'const fnParamsValues = []',
      'const memoize = true',
    ].join('\n'),
    python: '',
  },
]

describe('Runner for `node` language', () => {
  const nodeRunner = new RunnerFacade('node')

  test('Should return valid sucess objects', async () => {
    const nodeResult = await nodeRunner.buildRecursionTree(
      userDefinedCodeExamples[0].node
    )
    expect(nodeResult.isSuccess()).toBeTruthy()
  })

  test('Should return valid error objects', async () => {
    const nodeResult1 = await nodeRunner.buildRecursionTree(
      userDefinedCodeExamples[1].node
    )
    expect(nodeResult1.isError()).toBeTruthy()
    if (nodeResult1.isError())
      expect(nodeResult1.value.type).toEqual(
        ChildProcessError.ExceededRecursiveCallsLimit
      )

    // TODO: checar por runtime error
    const nodeResult2 = await nodeRunner.buildRecursionTree(
      userDefinedCodeExamples[2].node
    )
    expect(nodeResult2.isError()).toBeTruthy()

    // fallback recursive function
    const nodeResult3 = await nodeRunner.buildRecursionTree(
      userDefinedCodeExamples[3].node
    )
    expect(nodeResult3.isError()).toBeTruthy()
    if (nodeResult3.isError())
      expect(nodeResult3.value.type).toEqual(TreeError.EmptyTree)
  })
})

describe('Runner for `python` language', () => {
  const pythonRunner = new RunnerFacade('python')

  test('Should return valid success objects', async () => {
    const pythonResult = await pythonRunner.buildRecursionTree(
      userDefinedCodeExamples[0].python
    )
    expect(pythonResult.isSuccess()).toBeTruthy()
  })

  test('Should return valid error objects', async () => {
    // TODO
    const pythonResult = await pythonRunner.buildRecursionTree(userDefinedCodeExamples[0].node)
    expect(pythonResult.isError()).toBeTruthy()
  })
})

/*
describe('Runner for all languages', () => {
  const nodeRunner = new RunnerFacade('node')
  const pythonRunner = new RunnerFacade('python')

  test('The result for equivalent user-defined code should be equals to all supported languages', async () => {
    const nodeResult0 = await nodeRunner.buildRecursionTree(
      userDefinedCodeExamples[0].node
    )
    const pythonResult0 = await pythonRunner.buildRecursionTree(
      userDefinedCodeExamples[0].python
    )
    expect(nodeResult0).toEqual(pythonResult0)
  })
})
*/
