import { describe, expect, it } from '@jest/globals'
import {
  composeFnData,
  getParamsCallingValues,
  getParams,
  extractContentInsideFirstParentesis,
} from './../src/components/function-form/template-handler'

describe('template handler', () => {
  describe('composeFnData', () => {
    it.each([
      [
        {
          args: {
            lang: 'node',
            fnCode: 'function fn(a, b) { return 1 }',
            fnCall: 'fn("1","2")',
            fnGlobalVars: [],
          },
          expected: {
            body: 'return 1',
            params: [
              { name: 'a', initialValue: '"1"' },
              { name: 'b', initialValue: '"2"' },
            ],
          },
        },
      ],
      [
        {
          args: {
            lang: 'node',
            fnCode: 'function fn(a="1", b="2") { return 1 }',
            fnCall: 'fn()',
            fnGlobalVars: [],
          },
          expected: {
            body: 'return 1',
            params: [
              { name: 'a', initialValue: '"1"' },
              { name: 'b', initialValue: '"2"' },
            ],
          },
        },
      ],
      [
        {
          args: {
            lang: 'node',
            fnCode: 'function fn(a, b=2) { return 1 }',
            fnCall: 'fn(1)',
            fnGlobalVars: [],
          },
          expected: {
            body: 'return 1',
            params: [
              { name: 'a', initialValue: '1' },
              { name: 'b', initialValue: '2' },
            ],
          },
        },
      ],
      [
        {
          args: {
            lang: 'node',
            fnCode: 'function fn(a=0, b) { return 1 }',
            fnCall: 'fn(1,2)',
            fnGlobalVars: [],
          },
          expected: {
            body: 'return 1',
            params: [
              { name: 'a', initialValue: '1' },
              { name: 'b', initialValue: '2' },
            ],
          },
        },
      ],
      [
        {
          args: {
            lang: 'python',
            fnCode: 'def fn(a, b):\n\t return 1',
            fnCall: 'fn((1,2), [1,2,3])',
          },
          expected: {
            body: 'return 1',
            params: [
              { name: 'a', initialValue: '(1,2)' },
              { name: 'b', initialValue: '[1,2,3]' },
            ],
          },
        },
      ],
      [
        {
          args: {
            lang: 'python',
            fnCode: 'def fn(a, b=(1,2)):\n\t return 1',
            fnCall: 'fn(0)',
          },
          expected: {
            body: 'return 1',
            params: [
              { name: 'a', initialValue: '0' },
              { name: 'b', initialValue: '(1,2)' },
            ],
          },
        },
      ],
      [
        {
          args: {
            lang: 'node',
            fnCode: 'function fn(a, b=[0,1]) { return 1 }',
            fnCall: 'fn(1)',
          },
          expected: {
            body: 'return 1 ',
            params: [
              { name: 'a', initialValue: '1' },
              { name: 'b', initialValue: '[0,1]' },
            ],
          },
        },
      ],
    ])(
      'composeFnData, case %#',
      ({ args: { fnCode, fnCall, lang }, expected }: any) => {
        const actual = composeFnData(fnCode, fnCall, [], lang)
        expect(actual.body.trim()).toEqual(expected.body.trim())
        expect(actual.params).toEqual(expected.params)
      }
    )
  })

  describe('getParams', () => {
    it.each([
      { arg: '', expected: [] },
      { arg: ' ', expected: [] },
      { arg: 'a', expected: [{ name: 'a', default: null }] },
      {
        arg: 'a= 1 , b ',
        expected: [
          { name: 'a', default: '1' },
          { name: 'b', default: null },
        ],
      },
      {
        arg: 'a,b',
        expected: [
          { name: 'a', default: null },
          { name: 'b', default: null },
        ],
      },
      {
        arg: 'a, b=2',
        expected: [
          { name: 'a', default: null },
          { name: 'b', default: '2' },
        ],
      },
      {
        arg: 'a=1, b',
        expected: [
          { name: 'a', default: '1' },
          { name: 'b', default: null },
        ],
      },
      {
        arg: 'a="s"',
        expected: [{ name: 'a', default: '"s"' }],
      },
      {
        arg: 'a, b=[0,1]',
        expected: [
          { name: 'a', default: null },
          { name: 'b', default: '[0,1]' },
        ],
      },
      {
        arg: 'a=[0,1], b',
        expected: [
          { name: 'a', default: '[0,1]' },
          { name: 'b', default: null },
        ],
      },
      {
        arg: 'a=(0,1), b, c=[2,3], d',
        expected: [
          { name: 'a', default: '(0,1)' },
          { name: 'b', default: null },
          { name: 'c', default: '[2,3]' },
          { name: 'd', default: null },
        ],
      },
      {
        arg: 'a=[{"a":1,"b":2}, 1], b',
        expected: [
          { name: 'a', default: '[{"a":1,"b":2}, 1]' },
          { name: 'b', default: null },
        ],
      },
    ])(
      "given '$arg' should returns $expected",
      ({ arg, expected }: { arg: string; expected: (string | null)[] }) => {
        const actual = getParams(arg)
        expect(actual).toEqual(expected)
      }
    )
  })

  describe('getParamsCallingValues', () => {
    it.each([
      { arg: '', expected: [] },
      { arg: ' ', expected: [] },
      { arg: '(1,2)', expected: ['(1,2)'] },
      { arg: '[1,2]', expected: ['[1,2]'] },
      { arg: '{"a":1,"b":2}', expected: ['{"a":1,"b":2}'] },
      { arg: '[1,2], [1]', expected: ['[1,2]', '[1]'] },
      { arg: '[1,[2,3]], 1', expected: ['[1,[2,3]]', '1'] },
      {
        arg: '[1,[2,3]], {"a":1}, (1)',
        expected: ['[1,[2,3]]', '{"a":1}', '(1)'],
      },
    ])(
      "given '$arg' should returns $expected",
      ({ arg, expected }: { arg: string; expected: string[] }) => {
        const actual = getParamsCallingValues(arg)
        expect(actual).toEqual(expected)
      }
    )
  })

  describe('extractContentInsideFirstParentesis', () => {
    it.each([
      { arg: 'xxx(x())', expected: 'x()' },
      { arg: 'x((())())x', expected: '(())()' },
      { arg: '((())())', expected: '(())()' },
      { arg: '(x())()', expected: 'x()' },
    ])(
      "given '$arg' should returns $expected",
      ({ arg, expected }: { arg: string; expected: string[] }) => {
        const actual = extractContentInsideFirstParentesis(arg)
        expect(actual).toEqual(expected)
      }
    )
  })
})
