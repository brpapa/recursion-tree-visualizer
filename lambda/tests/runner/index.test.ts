import { describe, expect, test } from '@jest/globals'
import { ChildProcessError } from '../../src/errors/child-process'
import { TreeError } from '../../src/errors/tree'
import buildRunner from '../../src/runner'
import { FunctionData, SupportedLanguages } from '../../src/types'
import { templates } from '../../src/static/templates'

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
    describe('array of integer', () => {
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
    type Template = {
      name: string
      fnData: Record<SupportedLanguages, FunctionData>
    }
    
    for (const template of Object.values(templates) as Template[]) {
      describe(template.name, () => {
        const fnDataEntries = Object.entries(template.fnData) as [
          SupportedLanguages,
          FunctionData
        ][]

        for (const [lang, fnData] of fnDataEntries) {
          test(`and when lang is \`${lang}\``, async () => {
            const run = buildRunner(lang, baseOptions)
            const actual = await run(fnData)
            expect(actual.isSuccess()).toBeTruthy()
          })
        }

        for (let i = 0; i + 1 < fnDataEntries.length; i++) {
          const [langA, fnDataA] = fnDataEntries[i]
          const [langB, fnDataB] = fnDataEntries[i + 1]

          test(`and the generated trees for each language \`${langA}\` and \`${langB}\` should be the same`, async () => {
            const runA = buildRunner(langA, baseOptions)
            const runB = buildRunner(langB, baseOptions)

            const actualA = await runA(fnDataA)
            const actualB = await runB(fnDataB)

            expect(actualA).toEqual(actualB)
          })
        }  

      })
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
