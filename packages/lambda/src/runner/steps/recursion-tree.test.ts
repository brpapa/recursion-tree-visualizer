import { describe, expect, test } from '@jest/globals'

import { ChildProcessError, TreeError } from '../../errors'
import { flow } from 'fp-ts/lib/function'
import getSourceCode from './source-code'
import generateRecursionTree from './recursion-tree'
import { FunctionData, SupportedLanguages } from '../../types'
import translateToPlainCode from './plain-code'

type TestCase = Record<SupportedLanguages, FunctionData>

const successCases: TestCase[] = [
  {
    node: {
      globalVariables: [{ name: 'arr', value: '[1, 2, 3]' }],
      params: [
        { name: 'i', initialValue: '0' },
        { name: 's', initialValue: '7' },
      ],
      body: [
        '// i-th number of arr, missing s for the current subset to arrive at the target sum',
        '',
        'if (s == 0) return 1',
        'if (i == arr.length || s < 0) return 0',
        '',
        'return fn(i+1, s) + fn(i+1, s-arr[i])',
      ].join('\n'),
    },
    python: {
      globalVariables: [{ name: 'arr', value: '[1, 2, 3]' }],
      params: [
        { name: 'i', initialValue: '0' },
        { name: 's', initialValue: '7' },
      ],
      body: [
        '# i-th number of arr, missing s for the current subset to arrive at the target sum',
        '',
        'if (s == 0): return 1',
        'if (i == len(arr) or s < 0): return 0',
        '',
        'return fn(i+1, s) + fn(i+1, s-arr[i])',
      ].join('\n'),
    },
  },
  {
    node: {
      globalVariables: [
        { name: 'v', value: '[100,70,50,10]' },
        { name: 'w', value: '[10,4,6,12]' },
      ],
      params: [
        { name: 'i', initialValue: '0' },
        { name: 's', initialValue: '12' },
      ],
      body: [
        '// i-th item, knapsack with available capacity s',
        '',
        'if (s < 0) return -Infinity',
        'if (i == v.length) return 0',
        '',
        'return Math.max(',
        '  fn(i+1, s),',
        '  v[i] + fn(i+1, s-w[i])',
        ')',
      ].join('\n'),
    },
    python: {
      globalVariables: [
        { name: 'v', value: '[100,70,50,10]' },
        { name: 'w', value: '[10,4,6,12]' },
      ],
      params: [
        { name: 'i', initialValue: '0' },
        { name: 's', initialValue: '12' },
      ],
      body: [
        '# i-th item, knapsack with available capacity s',
        '',
        'if (s < 0): return -math.inf',
        'if (i == len(v)): return 0',
        '',
        'return max(',
        '  fn(i+1, s),',
        '  v[i] + fn(i+1, s-w[i])',
        ')',
      ].join('\n'),
    },
  },
  {
    node: {
      globalVariables: [{ name: 'coins', value: '[1,3,4,5]' }],
      params: [{ name: 'v', initialValue: '5' }],
      body: [
        '// remaining v cents',
        '',
        'if (v == 0) return 0',
        'if (v < 0) return Infinity',
        '',
        'let ans = Infinity',
        'for (const coin of coins)',
        '  ans = Math.min(',
        '    ans,',
        '    1 + fn(v - coin)',
        '  )',
        'return ans',
      ].join('\n'),
    },
    python: {
      globalVariables: [{ name: 'coins', value: '[1,3,4,5]' }],
      params: [{ name: 'v', initialValue: '5' }],
      body: [
        '# remaining v cents',
        '',
        'if (v == 0): return 0',
        'if (v < 0): return math.inf',
        '',
        'ans = math.inf',
        'for coin in coins:',
        '  ans = min(',
        '    ans,',
        '    1 + fn(v - coin)',
        '  )',
        'return ans',
      ].join('\n'),
    },
  },
  {
    node: {
      globalVariables: [
        { name: 'a', value: "'AGTB'" },
        { name: 'b', value: "'GTXAB'" },
      ],
      params: [
        { name: 'i', initialValue: '0' },
        { name: 'j', initialValue: '0' },
      ],
      body: [
        '// i-th char of a, j-th char of b',
        '',
        'if (i == a.length',
        ' || j == b.length) return 0',
        '',
        'if (a[i] == b[j])',
        '  return 1+fn(i+1, j+1)',
        '',
        'return Math.max(',
        '  fn(i+1, j),',
        '  fn(i, j+1)',
        ')',
      ].join('\n'),
    },
    python: {
      globalVariables: [
        { name: 'a', value: "'AGTB'" },
        { name: 'b', value: "'GTXAB'" },
      ],
      params: [
        { name: 'i', initialValue: '0' },
        { name: 'j', initialValue: '0' },
      ],
      body: [
        '# i-th char of a, j-th char of b',
        '',
        'if (i == len(a) or j == len(b)):',
        '  return 0',
        '',
        'if (a[i] == b[j]):',
        '  return 1+fn(i+1, j+1)',
        '',
        'return max(',
        '  fn(i+1, j),',
        '  fn(i, j+1)',
        ')',
      ].join('\n'),
    },
  },
  {
    node: {
      globalVariables: [
        { name: 'cities', value: '4' },
        {
          name: 'adjMat',
          value:
            '[[0, 20, 42, 35],\n [20, 0, 30, 34],\n [42, 30, 0, 12],\n [35, 34, 12, 0]]',
        },
      ],
      params: [
        { name: 'u', initialValue: '0' },
        { name: 'mask', initialValue: '1' },
      ],
      body: [
        '// current city u, set of visited cities mask (including u)',
        '',
        '// all cities were visited',
        'if (mask == (1 << cities) - 1)',
        '  return adjMat[u][0]',
        '',
        'let ans = Infinity',
        '',
        '// for each unvisited city v',
        'for (let v = 0; v < cities; v++)',
        '  if ((mask & (1 << v)) == 0)',
        '    ans = Math.min(',
        '      ans,',
        '      adjMat[u][v] + fn(v, mask | (1 << v))',
        '    )',
        '',
        'return ans',
      ].join('\n'),
    },
    python: {
      globalVariables: [
        { name: 'cities', value: '4' },
        {
          name: 'adjMat',
          value:
            '[[0, 20, 42, 35],\n [20, 0, 30, 34],\n [42, 30, 0, 12],\n [35, 34, 12, 0]]',
        },
      ],
      params: [
        { name: 'u', initialValue: '0' },
        { name: 'mask', initialValue: '1' },
      ],
      body: [
        '# current city u, set of visited cities mask (including u)',
        '',
        '# all cities were visited',
        'if (mask == (1 << cities) - 1):',
        '  return adjMat[u][0]',
        '',
        'ans = math.inf',
        '',
        '# for each unvisited city v',
        'for v in range(0, cities):',
        '  if ((mask & (1 << v)) == 0):',
        '    ans = min(',
        '      ans,',
        '      adjMat[u][v] + fn(v, mask | (1 << v))',
        '    )',
        '',
        'return ans',
      ].join('\n'),
    },
  },
  {
    node: {
      params: [
        { name: 'a', initialValue: '2' },
        { name: 'n', initialValue: '5' },
      ],
      body: [
        'if (n == 0)',
        '  return 1',
        '',
        'if (n % 2 == 0)',
        '  return fn(a*a, n/2)',
        '',
        'return a * fn(a*a, (n-1)/2)',
      ].join('\n'),
    },
    python: {
      params: [
        { name: 'a', initialValue: '2' },
        { name: 'n', initialValue: '5' },
      ],
      body: [
        'if (n == 0):',
        '  return 1',
        '',
        'if (n % 2 == 0):',
        '  return fn(a*a, n/2)',
        '',
        'return a * fn(a*a, (n-1)/2)',
      ].join('\n'),
    },
  },
]
const errorCases: TestCase[] = [
  {
    node: {
      body: 'return fn()',
    },
    python: {
      body: 'return fn()',
    },
  },
  {
    node: {
      body: 'return notDefined()',
    },
    python: {
      body: 'return notDefined()',
    },
  },
  {
    node: {
      body: '',
    },
    python: {
      body: 'pass',
    },
  },
  // TODO: testar: deveria voltar timeout
  {
    node: {
      body: 'let a = 1\nwhile(true) a++',
    },
    python: {
      body: '',
    },
  },
]

describe('Getting recursion tree from plain code', () => {
  const recursionTreeBuilder = (lang: SupportedLanguages) =>
    flow(
      (fnData: FunctionData) => translateToPlainCode(fnData, lang, { memoize: false }),
      (plainCode) => getSourceCode(plainCode, lang),
      (sourceCode) => generateRecursionTree(sourceCode, lang)
    )

  const buildRecursionTreeForPython = recursionTreeBuilder('python')
  const buildRecursionTreeForNode = recursionTreeBuilder('node')

  describe.each([
    [successCases[0], 'Subset Sum'],
    [successCases[1], '0-1 Knapsack'],
    [successCases[2], 'Coin Change'],
    [successCases[3], 'Longest Common Subsequence'],
    [successCases[4], 'Traveling Salesman Problem'],
    [successCases[5], 'Fast Power'],
  ])('Success test case %#: %c%s', (tc: TestCase) => {
    test(`Should return success object for 'node' language`, async () => {
      const res = await buildRecursionTreeForNode(tc.node)
      expect(res.isSuccess()).toBeTruthy()
    })
    test(`Should return success object for 'python' language`, async () => {
      const res = await buildRecursionTreeForPython(tc.python)
      expect(res.isSuccess()).toBeTruthy()
    })
    test('Should return exactly the same object between all supported languages', async () => {
      const nodeRes = await buildRecursionTreeForNode(tc.node)
      const pythonRes = await buildRecursionTreeForPython(tc.python)
      expect(nodeRes.value).toEqual(pythonRes.value)
    })
  })

  describe.each([
    [errorCases[0], ChildProcessError.ExceededRecursiveCallsLimit],
    [errorCases[1], ChildProcessError.RuntimeError],
    [errorCases[2], TreeError.EmptyTree],
    // [errorCases[3], TreeError.EmptyTree],
  ])(
    'Error test case %#: %c%s',
    (tc: TestCase, expectedError: ChildProcessError | TreeError) => {
      test(`Should return the expected error type for 'node' language`, async () => {
        const res = await buildRecursionTreeForNode(tc.node)
        expect(res.isError()).toBeTruthy()
        if (res.isError()) expect(res.value.type).toEqual(expectedError)
      })
      test(`Should return the expected error type for 'python' language`, async () => {
        const res = await buildRecursionTreeForPython(tc.python)
        expect(res.isError()).toBeTruthy()
        if (res.isError()) {
          // console.log(res.value)
          expect(res.value.type).toEqual(expectedError)
        }
      })
    }
  )
})
