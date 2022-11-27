import { describe, expect, test } from '@jest/globals'
import { ChildProcessError } from '../../src/errors/child-process'
import { TreeError } from '../../src/errors/tree'
import buildRunner from '../../src/runner'
import { FunctionData, SupportedLanguages } from '../../src/types'

const baseOptions = { tmpDirPath: './_tmp' }
const runPython = buildRunner('python', baseOptions)
const runNode = buildRunner('node', baseOptions)

describe('should return success', () => {
  describe('when contains single quotes', () => {
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

  describe('when contains double quotes', () => {
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
    describe('only on `body`', () => {
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

  describe('when the function logs to stdout', () => {
    registerTests({
      python: {
        params: [{ name: 'i', initialValue: '1' }],
        body: [
          'print("a log to stdout")',
          'if i == 0: return 0',
          'return fn(i-1)',
        ].join('\n'),
      },
      node: {
        params: [{ name: 'i', initialValue: '1' }],
        body: [
          'console.log("a log to stdout")',
          'if (i == 0) return 0',
          'return fn(i-1)',
        ].join('\n'),
      },
      golang: {
        params: [{ name: 'i', type: 'int', initialValue: '1' }],
        returnType: 'int',
        body: [
          'fmt.Printf("a log to stdout")',
          'if i == 0 { return 0 }',
          'return fn(i-1)',
        ].join('\n'),
      },
    })

    function registerTests(set: Record<SupportedLanguages, FunctionData>) {
      const entries = Object.entries(set) as [
        SupportedLanguages,
        FunctionData
      ][]

      entries.forEach(([lang, fnData]) => {
        test(`and when lang is \`${lang}\``, async () => {
          const run = buildRunner(lang, baseOptions)
          const actual = await run(fnData)
          expect(actual.isSuccess()).toBeTruthy()
          if (actual.isSuccess()) {
            expect(actual.value.logs).toContain('fn(1) returns 0')
          }
        })
      })
    }
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
      const runWithMemo = buildRunner(lang, { ...baseOptions, memoize: true })
      const runWithoutMemo = buildRunner(lang, baseOptions)

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

  describe('when the return type and one param type are', () => {
    describe('null', () => {
      registerTests(
        {
          python: createFnData('python', 'None'),
          node: createFnData('node', 'null'),
          golang: createFnData('golang', 'nil', '*int'),
        },
        'null'
      )
    })
    describe('string', () => {
      registerTests(
        {
          python: createFnData('python', '"abc/!@#$%^&*()-+_={}[]|:cba"'),
          node: createFnData('node', '"abc/!@#$%^&*()-+_={}[]|:cba"'),
          golang: createFnData(
            'golang',
            '"abc/!@#$%^&*()-+_={}[]|:cba"',
            'string'
          ),
        },
        'abc/!@#$%^&*()-+_={}[]|:cba'
      )
    })
    describe('boolean', () => {
      registerTests(
        {
          python: createFnData('python', 'True'),
          node: createFnData('node', 'true'),
          golang: createFnData('golang', 'true', 'bool'),
        },
        'true'
      )
    })
    describe('integer', () => {
      registerTests(
        {
          python: createFnData('python', '123'),
          node: createFnData('node', '123'),
          golang: createFnData('golang', '123', 'int'),
        },
        '123'
      )
    })
    describe('floating point', () => {
      registerTests(
        {
          python: createFnData('python', '0.123456789'),
          node: createFnData('node', '0.123456789'),
          golang: createFnData('golang', '0.123456789', 'float64'),
        },
        '0.123456789'
      )
    })
    describe('positive infinity', () => {
      registerTests(
        {
          python: createFnData('python', 'math.inf'),
          node: createFnData('node', 'Infinity'),
          golang: createFnData('golang', 'math.Inf(1)', 'float64'),
        },
        '∞'
      )
    })
    describe('negative infinity', () => {
      registerTests(
        {
          python: createFnData('python', '-math.inf'),
          node: createFnData('node', '-Infinity'),
          golang: createFnData('golang', 'math.Inf(-1)', 'float64'),
        },
        '-∞'
      )
    })
    describe('not a number', () => {
      registerTests(
        {
          python: createFnData('python', 'math.nan'),
          node: createFnData('node', 'NaN'),
          golang: createFnData('golang', 'math.NaN()', 'float64'),
        },
        'NaN'
      )
    })
    describe('array<integer>', () => {
      registerTests(
        {
          python: createFnData('python', '[0,1,2,3]'),
          node: createFnData('node', '[0,1,2,3]'),
          golang: createFnData('golang', '[]int{0,1,2,3}', '[]int'),
        },
        '[0,1,2,3]'
      )
    })
    test.todo('map<string, string>')

    function registerTests(
      paramValues: Record<SupportedLanguages, FunctionData>,
      expected: string
    ) {
      const entries = Object.entries(paramValues) as [
        SupportedLanguages,
        FunctionData
      ][]

      entries.forEach(([lang, fnData]) => {
        test(`and when lang is \`${lang}\``, async () => {
          const run = buildRunner(lang, baseOptions)
          const actual = await run(fnData)

          expect(actual.isSuccess()).toBeTruthy()

          if (actual.isSuccess()) {
            expect(actual.value.verticesData[0]?.label).toEqual(`${expected},1`)
            expect(actual.value.verticesData[1]?.label).toEqual(`${expected},0`)

            expect(actual.value.edgesData['[1,0]']?.label).toEqual(expected)

            expect(actual.value.logs).toEqual([
              `fn(${expected},1) starts running`,
              `fn(${expected},1) calls fn(${expected},0)`,
              `fn(${expected},0) starts running`,
              `fn(${expected},0) returns ${expected} to fn(${expected},1)`,
              `fn(${expected},1) continues running`,
              `fn(${expected},1) returns ${expected}`,
            ])
          }
        })
      })
    }

    function createFnData(
      lang: SupportedLanguages,
      value: string,
      type?: string
    ): FunctionData {
      return {
        python: {
          params: [
            { name: 'p', initialValue: value },
            { name: 'v', initialValue: '1' },
          ],
          body: `if (v == 0): return ${value}\nreturn fn(p,v-1)`,
        },
        node: {
          params: [
            { name: 'p', initialValue: value },
            { name: 'v', initialValue: '1' },
          ],
          body: `if (v == 0) return ${value}\nreturn fn(p,v-1)`,
        },
        golang: {
          params: [
            { name: 'p', type: type, initialValue: value },
            { name: 'v', type: 'int', initialValue: '1' },
          ],
          returnType: type,
          body: `if v == 0 {\n return ${value}\n}\nreturn fn(p,v-1)`,
        },
      }[lang]
    }
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
        golang: {
          globalVariables: [{ name: 'arr', value: '[]int{1, 2, 3}' }],
          params: [
            { name: 'i', type: 'int', initialValue: '0' },
            { name: 's', type: 'int', initialValue: '7' },
          ],
          returnType: 'int',
          body: [
            '// i-th number of arr, missing s for the current subset to arrive at the target sum',
            '',
            'if s == 0 {',
            ' return 1',
            '}',
            'if i == len(arr) || s < 0 {',
            ' return 0',
            '}',
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
        golang: {
          globalVariables: [
            { name: 'v', value: '[]int{100,70,50,10}' },
            { name: 'w', value: '[]int{10,4,6,12}' },
          ],
          params: [
            { name: 'i', type: 'int', initialValue: '0' },
            { name: 's', type: 'int', initialValue: '12' },
          ],
          returnType: 'float64',
          body: [
            '// i-th item, knapsack with available capacity s',
            '',
            'if s < 0 {',
            ' return math.Inf(-1)',
            '}',
            'if i == len(v) {',
            ' return 0',
            '}',
            '',
            'return math.Max(',
            '  fn(i+1, s),',
            '  float64(v[i]) + fn(i+1, s-w[i]),',
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
        golang: {
          globalVariables: [{ name: 'coins', value: '[]int{1,3,4,5}' }],
          params: [{ name: 'v', type: 'int', initialValue: '5' }],
          returnType: 'float64',
          body: [
            '// remaining v cents',
            '',
            'if v == 0 {',
            ' return 0',
            '}',
            'if v < 0 {',
            ' return math.Inf(1)',
            '}',
            '',
            'ans := math.Inf(1)',
            'for _, coin := range coins {',
            '  ans = math.Min(',
            '    ans,',
            '    float64(1) + fn(v - coin),',
            '  )',
            '}',
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
            'if (i == a.length || j == b.length) return 0',
            '',
            'if (a[i] == b[j])',
            '  return 1 + fn(i+1, j+1)',
            '',
            'return Math.max(',
            '  fn(i+1, j),',
            '  fn(i, j+1)',
            ')',
          ].join('\n'),
        },
        golang: {
          globalVariables: [
            { name: 'a', value: '"AGTB"' },
            { name: 'b', value: '"GTXAB"' },
          ],
          params: [
            { name: 'i', type: 'int', initialValue: '0' },
            { name: 'j', type: 'int', initialValue: '0' },
          ],
          returnType: 'int',
          body: [
            '// i-th char of a, j-th char of b',
            '',
            'if i == len(a) || j == len(b) {',
            ' return 0',
            '}',
            'if a[i] == b[j] {',
            ' return 1 + fn(i+1, j+1)',
            '}',
            '',
            'return int(math.Max(',
            ' float64(fn(i+1, j)),',
            ' float64(fn(i, j+1)),',
            '))',
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
              value: [
                '[[0, 20, 42, 35],',
                ' [20, 0, 30, 34],',
                ' [42, 30, 0, 12],',
                ' [35, 34, 12, 0]]',
              ].join('\n'),
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
              value: [
                '[[0, 20, 42, 35],',
                ' [20, 0, 30, 34],',
                ' [42, 30, 0, 12],',
                ' [35, 34, 12, 0]]',
              ].join('\n'),
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
        golang: {
          globalVariables: [
            { name: 'cities', value: '4' },
            {
              name: 'adjMat',
              value: [
                '[][]int{',
                ' {0, 20, 42, 35},',
                ' {20, 0, 30, 34},',
                ' {42, 30, 0, 12},',
                ' {35, 34, 12, 0},',
                '}',
              ].join('\n'),
            },
          ],
          params: [
            { name: 'u', type: 'int', initialValue: '0' },
            { name: 'mask', type: 'int', initialValue: '1' },
          ],
          returnType: 'float64',
          body: [
            '// current city u, set of visited cities mask (including u)',
            '',
            '// all cities were visited',
            'if mask == (1 << cities) - 1 {',
            '  return float64(adjMat[u][0])',
            '}',
            '',
            'ans := math.Inf(1)',
            '',
            '// for each unvisited city v',
            'for v := 0; v < cities; v++ {',
            '  if ((mask & (1 << v)) == 0) {',
            '    ans = math.Min(',
            '      ans,',
            '      float64(adjMat[u][v]) + fn(v, mask | (1 << v)),',
            '    )',
            '  }',
            '}',
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
        golang: {
          params: [
            { name: 'a', type: 'int', initialValue: '2' },
            { name: 'n', type: 'int', initialValue: '5' },
          ],
          returnType: 'int',
          body: [
            'if n == 0 {',
            '  return 1',
            '}',
            '',
            'if n % 2 == 0 {',
            '  return fn(a*a, n/2)',
            '}',
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
          const run = buildRunner(lang, baseOptions)
          const actual = await run(fnData)
          expect(actual.isSuccess()).toBeTruthy()
        })
      })

      for (let i = 0; i + 1 < entries.length; i++) {
        const [langA, fnDataA] = entries[i]
        const [langB, fnDataB] = entries[i + 1]

        test(`and the generated trees for each language \`${langA}\` and \`${langB}\` should be the same`, async () => {
          const runA = buildRunner(langA, baseOptions)
          const runB = buildRunner(langB, baseOptions)

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
    registerTests({
      python: {
        body: 'pass',
      },
      node: {
        body: '',
      },
      golang: {
        returnType: 'int',
        body: 'return 1',
      },
    })

    function registerTests(set: Record<SupportedLanguages, FunctionData>) {
      const entries = Object.entries(set) as [
        SupportedLanguages,
        FunctionData
      ][]

      entries.forEach(([lang, fnData]) => {
        test(`and when lang is \`${lang}\``, async () => {
          const run = buildRunner(lang, baseOptions)
          const actual = await run(fnData)
          expect(actual.isError()).toBeTruthy()
          if (actual.isError()) {
            expect(actual.value.type).toEqual(TreeError.EmptyTree)
            expect(actual.value.reason).toEqual('The recursion tree is empty')
          }
        })
      })
    }
  })

  describe('`TreeError.ExceededSourceCodeSizeLimit`', () => {
    registerTests({
      python: {
        body: 'veryyyyyyy long function body',
      },
      node: {
        body: 'veryyyyyyy long function body',
      },
      golang: {
        returnType: 'int',
        body: 'veryyyyyyy long function body',
      },
    })

    function registerTests(set: Record<SupportedLanguages, FunctionData>) {
      const entries = Object.entries(set) as [
        SupportedLanguages,
        FunctionData
      ][]

      entries.forEach(([lang, fnData]) => {
        test(`and when lang is \`${lang}\``, async () => {
          const run = buildRunner(lang, {
            ...baseOptions,
            tmpFileMaxSizeBytes: 1000,
          })
          const actual = await run(fnData)
          expect(actual.isError()).toBeTruthy()
          if (actual.isError()) {
            expect(actual.value.type).toEqual(
              TreeError.ExceededSourceCodeSizeLimit
            )
            expect(actual.value.reason).toEqual(
              'The source code size exceeded the limit of 1000 bytes'
            )
          }
        })
      })
    }
  })

  describe('`TreeError.ExceededRecursiveCallsLimit`', () => {
    describe('when there is not algebraic operation with function return value', () => {
      registerTests({
        python: {
          body: 'return fn()',
        },
        node: {
          body: 'return fn()',
        },
        golang: {
          returnType: 'int',
          body: 'return fn()',
        },
      })
    })
    describe('when there is some algebraic operation with function return value', () => {
      registerTests({
        python: {
          body: 'return 1 + fn()',
        },
        node: {
          body: 'return 1 + fn()',
        },
        golang: {
          returnType: 'int',
          body: 'return 1 + fn()',
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
          const run = buildRunner(lang, {
            ...baseOptions,
            maxRecursiveCalls: 5,
          })
          const actual = await run(fnData)
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
    }
  })

  describe('`ChildProcessError.RuntimeError`', () => {
    describe('when a not defined variable is called', () => {
      registerTests({
        python: {
          fnData: { body: 'return notDefined' },
          expectedReason:
            "Your code outputs the NameError: name 'notDefined' is not defined",
        },
        node: {
          fnData: { body: 'return notDefined' },
          expectedReason:
            'Your code outputs the ReferenceError: notDefined is not defined',
        },
        golang: {
          fnData: { returnType: 'int', body: 'return notDefined' },
          expectedReason:
            'Your code outputs the Error: undefined: notDefined',
        },
      })
    })
    describe('when there is a unsupported operation', () => {
      registerTests({
        python: {
          fnData: {
            params: [{ name: 'n', initialValue: '10' }],
            body: ['if (n < 1): return True', "return '1' + fn(n-1)"].join(
              '\n'
            ),
          },
          expectedReason:
            'Your code outputs the TypeError: can only concatenate str (not "bool") to str',
        },
        golang: {
          fnData: {
            params: [{ name: 'n', type: 'int', initialValue: '10' }],
            returnType: 'int',
            body: ['if n < 1 {', ' return 1', '}', 'return float64(1) + fn(n-1)'].join(
              '\n'
            ),
          },
          expectedReason:
            'Your code outputs the Error: invalid operation: float64(1) + fn(n - 1) (mismatched types float64 and int)',
        },
      })
    })
    describe('when there is a uncaught error', () => {
      registerTests({
        python: {
          fnData: {
            body: "raise Exception('any message')",
          },
          expectedReason:
            'Your code outputs the Exception: any message',
        },
        node: {
          fnData: {
            body: "throw new Error('any message')",
          },
          expectedReason: 'Your code outputs the Error: any message',
        },
        golang: {
          fnData: {
            returnType: 'int',
            body: 'panic("any message")',
          },
          expectedReason: 'Your code outputs the Error: any message',
        },
      })
    })

    function registerTests(
      set: Partial<
        Record<
          SupportedLanguages,
          { fnData: FunctionData; expectedReason: string }
        >
      >
    ) {
      const entries = Object.entries(set) as [
        SupportedLanguages,
        { fnData: FunctionData; expectedReason: string }
      ][]

      entries.forEach(([lang, args]) => {
        test(`and when lang is \`${lang}\``, async () => {
          const run = buildRunner(lang, baseOptions)
          const actual = await run(args.fnData)
          expect(actual.isError()).toBeTruthy()
          if (actual.isError()) {
            expect(actual.value.type).toEqual(ChildProcessError.RuntimeError)
            expect(actual.value.reason).toEqual(args.expectedReason)
          }
        })
      })
    }
  })

  describe('`ChildProcessError.Timeout`', () => {
    registerTests({
      python: {
        body: ['a = 1', 'while (True): a += 1'].join('\n'),
      },
      node: {
        body: ['let a = 1', 'while (true) a++'].join('\n'),
      },
      golang: {
        returnType: 'int',
        body: ['a := 1', 'for true { a += 1 }'].join('\n'),
      },
    })
    
    function registerTests(set: Record<SupportedLanguages, FunctionData>) {
      const entries = Object.entries(set) as [
        SupportedLanguages,
        FunctionData
      ][]

      entries.forEach(([lang, fnData]) => {
        test(`and when lang is \`${lang}\``, async () => {
          const run = buildRunner(lang, {
            ...baseOptions,
            timeoutMs: 50,
          })
          const actual = await run(fnData)
          expect(actual.isError()).toBeTruthy()
          if (actual.isError()) {
            expect(actual.value.type).toEqual(ChildProcessError.TimeoutError)
            expect(actual.value.reason).toEqual(
              'The execution time limit of 0.05s was exceeded'
            )
          }
        })
      })
    }
  })
})
