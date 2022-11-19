import { describe, expect, test } from '@jest/globals'
import { ChildProcessError } from '../../src/errors/child-process'
import { TreeError } from '../../src/errors/tree'
import buildRunner from '../../src/runner'
import { FunctionData, SupportedLanguages } from '../../src/types'

const runPython = buildRunner('python', { memoize: false })
const runNode = buildRunner('node', { memoize: false })

describe('should return success', () => {
  describe('when user input contains single quotes', () => {
    test('and when lang is `python`', async () => {
      const actual = await runPython({
        params: [{ name: 'str', initialValue: "'abc'" }],
        body: ["if str == '': return ''", 'return fn(str[1:]) + str[0]'].join(
          '\n'
        ),
      })
      expect(actual.isSuccess()).toBeTruthy()
    })
    test('and when lang is `node`', async () => {
      const actual = await runNode({
        params: [{ name: 'str', initialValue: "'abc'" }],
        body: [
          "if (str === '') return ''",
          'return fn(str.substr(1, str.length)) + str[0]',
        ].join('\n'),
      })
      expect(actual.isSuccess()).toBeTruthy()
    })
  })
  describe('when user input contains double quotes', () => {
    describe('only on `params.initialValue`', () => {
      test('and when lang is `python`', async () => {
        const actual = await runPython({
          params: [{ name: 'str', initialValue: '"abc"' }],
          body: ["if str == '': return ''", 'return fn(str[1:]) + str[0]'].join(
            '\n'
          ),
        })
        expect(actual.isSuccess()).toBeTruthy()
      })
      test('and when lang is `node`', async () => {
        const actual = await runNode({
          params: [{ name: 'str', initialValue: '"abc"' }],
          body: [
            "if (str === '') return ''",
            'return fn(str.substr(1, str.length)) + str[0]',
          ].join('\n'),
        })
        expect(actual.isSuccess()).toBeTruthy()
      })
    })
    describe('only on body', () => {
      test('and when lang is `python`', async () => {
        const actual = await runPython({
          params: [{ name: 'str', initialValue: "'abc'" }],
          body: [
            'if str == \'\': return ""',
            'return fn(str[1:]) + str[0]',
          ].join('\n'),
        })
        expect(actual.isSuccess()).toBeTruthy()
      })
      test('and when lang is `node`', async () => {
        const actual = await runNode({
          params: [{ name: 'str', initialValue: "'abc'" }],
          body: [
            'if (str === \'\') return ""',
            'return fn(str.substr(1, str.length)) + str[0]',
          ].join('\n'),
        })
        expect(actual.isSuccess()).toBeTruthy()
      })
    })
  })
  describe('when memoize is enabled', () => {
    test('and when lang is `python`', async () => {
      const fnData: FunctionData = {
        params: [
          { name: 'n', initialValue: '5' },
          { name: 'k', initialValue: '2' },
        ],
        body: [
          'if (k == 0 or n == k): return 1',
          'return fn(n-1, k-1) + fn(n-1, k)',
        ].join('\n'),
      }
      compareWithAndWithoutMemoize('python', fnData)
    })
    test('and when lang is `node`', async () => {
      const fnData: FunctionData = {
        params: [
          { name: 'n', initialValue: '5' },
          { name: 'k', initialValue: '2' },
        ],
        body: [
          'if (k == 0 || n == k) return 1',
          'return fn(n-1, k-1) + fn(n-1, k)',
        ].join('\n'),
      }
      compareWithAndWithoutMemoize('node', fnData)
    })

    async function compareWithAndWithoutMemoize(
      lang: SupportedLanguages,
      fnData: FunctionData
    ) {
      const runWithMemo = buildRunner(lang, { memoize: true })
      const runWithoutMemo = buildRunner(lang, { memoize: false })

      const resultWithMemoize = await runWithMemo(fnData)
      expect(resultWithMemoize.isSuccess()).toBeTruthy()

      const resultWithoutMemoize = await runWithoutMemo(fnData)
      expect(resultWithoutMemoize.isSuccess()).toBeTruthy()

      if (resultWithoutMemoize.isSuccess() && resultWithMemoize.isSuccess())
        expect(resultWithoutMemoize.value.times).toBeGreaterThan(
          resultWithMemoize.value.times
        )
    }
  })
  describe('when function return have multiple types', () => {
    test('and when lang is `python`', async () => {
      const actual = await runPython({
        globalVariables: [
          { name: 'steps', value: '3' },
          { name: 'arrLen', value: '2' },
        ],
        params: [
          { name: 'idx', initialValue: '0' },
          { name: 'step', initialValue: 'steps' },
        ],
        body: [
          'if idx < 0 or idx >= arrLen:',
          '    return 0',
          'if 0 == step:',
          '    return 0 == idx',
          'return (fn(idx - 1, step - 1) + fn(idx + 1, step - 1) + fn(idx, step - 1)) % 1000000007',
        ].join('\n'),
      })
      expect(actual.isSuccess()).toBeTruthy()
    })
    test.todo('and when lang is `node`')
  })
  describe('when function return can be `Infinity`', () => {
    test.todo('and when lang is `python`')
    test('and when lang is `node`', async () => {
      const actual = await runNode({
        globalVariables: [{ name: 'coins', value: '[1,3,4,5]' }],
        params: [{ name: 'v', initialValue: '5' }],
        body: [
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
      })
      expect(actual.isSuccess()).toBeTruthy()
    })
  })
  describe('when function is the template', () => {
    describe('subset sum', () => {
      registerTests({
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
      })
    })
    describe('0-1 knapsack', () => {
      registerTests({
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
      })
    })
    describe('coin change', () => {
      registerTests({
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
      })
    })
    describe('longest common subsequence', () => {
      registerTests({
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
      })
    })
    describe('traveling salesman problem', () => {
      registerTests({
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
      })
    })
    describe('fast power', () => {
      registerTests({
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
      })
    })

    function registerTests(set: Record<SupportedLanguages, FunctionData>) {
      const entries = Object.entries(set) as [
        SupportedLanguages,
        FunctionData
      ][]

      entries.forEach(([lang, fnData]) => {
        test(`and when lang is \`${lang}\``, async () => {
          const run = buildRunner(lang, { memoize: false })
          const actual = await run(fnData)
          expect(actual.isSuccess()).toBeTruthy()
        })
      })

      for (let i = 0; i + 1 < entries.length; i++) {
        const [langA, fnDataA] = entries[i]
        const [langB, fnDataB] = entries[i + 1]

        test(`and the generated trees for each language \`${langA}\` and \`${langB}\` should be the same`, async () => {
          const runA = buildRunner(langA, { memoize: false })
          const runB = buildRunner(langB, { memoize: false })

          const actualA = await runA(fnDataA)
          const actualB = await runB(fnDataB)

          expect(actualA).toEqual(actualB)
        })
      }
    }
  })
})

describe('should return error', () => {
  describe('`TreeError.EmptyTree`', () => {
    test('and when lang is `python`', async () => {
      const actual = await runPython({
        body: 'pass',
      })
      expect(actual.isError()).toBeTruthy()
      if (actual.isError()) {
        expect(actual.value.type).toEqual(TreeError.EmptyTree)
        expect(actual.value.reason).toEqual('The recursion tree is empty')
      }
    })
    test('and when lang is `node`', async () => {
      const actual = await runNode({
        body: '',
      })
      expect(actual.isError()).toBeTruthy()
      if (actual.isError()) {
        expect(actual.value.type).toEqual(TreeError.EmptyTree)
        expect(actual.value.reason).toEqual('The recursion tree is empty')
      }
    })
  })
  describe('`TreeError.ExceededRecursiveCallsLimit`', () => {
    describe('when there is not algebraic operation with function return value', () => {
      test('and when lang is `python`', async () => {
        const run = buildRunner('python', {
          memoize: false,
          maxRecursiveCalls: 5,
        })
        const actual = await run({
          body: 'return fn()',
        })
        expect(actual.isError()).toBeTruthy()
        if (actual.isError()) {
          expect(actual.value.type).toEqual(
            TreeError.ExceededRecursiveCallsLimit
          )
          expect(actual.value.reason).toEqual(
            'The limit of 5 recursive calls was exceeded'
          )
        }
      })
      test('and when lang is `node`', async () => {
        const run = buildRunner('node', {
          memoize: false,
          maxRecursiveCalls: 5,
        })
        const actual = await run({
          body: 'return fn()',
        })
        expect(actual.isError()).toBeTruthy()
        if (actual.isError()) {
          expect(actual.value.type).toEqual(
            TreeError.ExceededRecursiveCallsLimit
          )
          expect(actual.value.reason).toEqual(
            'The limit of 5 recursive calls was exceeded'
          )
        }
      })
    })
    describe('when there is some algebraic operation with function return value', () => {
      test('and when lang is `python`', async () => {
        const run = buildRunner('python', {
          memoize: false,
          maxRecursiveCalls: 5,
        })
        const actual = await run({
          body: 'return 1 + fn()',
        })
        expect(actual.isError()).toBeTruthy()
        if (actual.isError()) {
          expect(actual.value.type).toEqual(
            TreeError.ExceededRecursiveCallsLimit
          )
          expect(actual.value.reason).toEqual(
            'The limit of 5 recursive calls was exceeded'
          )
        }
      })
      test('and when lang is `node`', async () => {
        const run = buildRunner('node', {
          memoize: false,
          maxRecursiveCalls: 5,
        })
        const actual = await run({
          body: 'return 1 + fn()',
        })
        expect(actual.isError()).toBeTruthy()
        if (actual.isError()) {
          expect(actual.value.type).toEqual(
            TreeError.ExceededRecursiveCallsLimit
          )
          expect(actual.value.reason).toEqual(
            'The limit of 5 recursive calls was exceeded'
          )
        }
      })
    })
  })
  describe('`ChildProcessError.RuntimeError`', () => {
    describe('when a not defined variable is called', () => {
      test('and when lang is `python`', async () => {
        const actual = await runPython({
          body: 'return notDefined',
        })
        expect(actual.isError()).toBeTruthy()
        if (actual.isError()) {
          expect(actual.value.type).toEqual(ChildProcessError.RuntimeError)
          expect(actual.value.reason).toEqual(
            "Your code outputs the following NameError: name 'notDefined' is not defined"
          )
        }
      })
      test('and when lang is `node`', async () => {
        const actual = await runNode({
          body: 'return notDefined',
        })
        expect(actual.isError()).toBeTruthy()
        if (actual.isError()) {
          expect(actual.value.type).toEqual(ChildProcessError.RuntimeError)
          expect(actual.value.reason).toEqual(
            'Your code outputs the following ReferenceError: notDefined is not defined'
          )
        }
      })
    })
    describe('when there is a not supported operation', () => {
      test('and when lang is `python`', async () => {
        const actual = await runPython({
          params: [{ name: 'n', initialValue: '10' }],
          body: ['if (n < 1): return True', "return '1' + fn(n-1)"].join('\n'),
        })
        expect(actual.isError()).toBeTruthy()
        if (actual.isError()) {
          expect(actual.value.type).toEqual(ChildProcessError.RuntimeError)
          expect(actual.value.reason).toEqual(
            'Your code outputs the following TypeError: can only concatenate str (not "bool") to str'
          )
        }
      })
    })
    describe('when there is a uncaught error', () => {
      test('and when lang is `python`', async () => {
        const actual = await runPython({
          body: "raise Exception('any message')",
        })
        expect(actual.isError()).toBeTruthy()
        if (actual.isError()) {
          expect(actual.value.type).toEqual(ChildProcessError.RuntimeError)
          expect(actual.value.reason).toEqual(
            'Your code outputs the following Exception: any message'
          )
        }
      })
      test('and when lang is `node`', async () => {
        const actual = await runNode({
          body: "throw new Error('any message')",
        })
        expect(actual.isError()).toBeTruthy()
        if (actual.isError()) {
          expect(actual.value.type).toEqual(ChildProcessError.RuntimeError)
          expect(actual.value.reason).toEqual(
            'Your code outputs the following Error: any message'
          )
        }
      })
    })
  })
  describe('`TreeError.Timeout`', () => {
    test('and when lang is `python`', async () => {
      const run = buildRunner('python', { memoize: false, timeoutMs: 50 })
      const actual = await run({
        body: ['a = 1', 'while (True): a += 1'].join('\n'),
      })
      expect(actual.isError()).toBeTruthy()
      if (actual.isError()) {
        expect(actual.value.type).toEqual(ChildProcessError.TimeoutError)
        expect(actual.value.reason).toEqual(
          'The execution time limit of 0.05s was exceeded'
        )
      }
    })
    test('and when lang is `node`', async () => {
      const run = buildRunner('node', { memoize: false, timeoutMs: 50 })
      const actual = await run({
        body: ['let a = 1', 'while (true) a++'].join('\n'),
      })
      expect(actual.isError()).toBeTruthy()
      if (actual.isError()) {
        expect(actual.value.type).toEqual(ChildProcessError.TimeoutError)
        expect(actual.value.reason).toEqual(
          'The execution time limit of 0.05s was exceeded'
        )
      }
    })
  })
})
