import { describe, expect, test } from '@jest/globals'
import { toUserCode } from '../../src/runner/steps/source-code'

describe('should generate user code from function data', () => {
  test('when lang is `node`', () => {
    const fnData = {
      globalVariables: [{ name: 'arr', value: '[1,3,4,5,2,10]' }],
      params: [
        { name: 'i', initialValue: '0' },
        { name: 's', initialValue: '7' },
      ],
      body: [
        'if (s == 0) return 1',
        'if (i == arr.length || s < 0) return 0',
        '',
        'return fn(i+1, s) + fn(i+1, s-arr[i])',
      ].join('\n'),
    }

    const actual = toUserCode(fnData, 'node', false)
    const expected = [
      'const arr = [1,3,4,5,2,10]',
      '',
      'function _fn(i, s) {',
      '  if (s == 0) return 1',
      '  if (i == arr.length || s < 0) return 0',
      '  ',
      '  return fn(i+1, s) + fn(i+1, s-arr[i])',
      '}',
      '',
      'const memoize = false',
    ].join('\n')

    expect(actual).toEqual(expected)
  })

  test('when lang is `python`', () => {
    const fnData = {
      globalVariables: [{ name: 'arr', value: '[1,3,4,5,2,10]' }],
      params: [
        { name: 'i', initialValue: '0' },
        { name: 's', initialValue: '7' },
      ],
      body: [
        'if (s == 0): return 1',
        'if (i == arr.length or s < 0): return 0',
        '',
        'return fn(i+1, s) + fn(i+1, s-arr[i])',
      ].join('\n'),
    }

    const actual = toUserCode(fnData, 'python', true)
    const expected = [
      'arr = [1,3,4,5,2,10]',
      '',
      'def _fn(i, s):',
      '  if (s == 0): return 1',
      '  if (i == arr.length or s < 0): return 0',
      '  ',
      '  return fn(i+1, s) + fn(i+1, s-arr[i])',
      '',
      'memoize = True',
    ].join('\n')

    expect(actual).toEqual(expected)
  })

  test('when lang is `golang`', () => {
    const fnData = {
      globalVariables: [{ name: 'arr', value: '[]int{1,3,4,5,2,10}' }],
      params: [
        { name: 'i', type: 'int', initialValue: '0' },
        { name: 's', type: 'int', initialValue: '7' },
      ],
      returnType: 'int',
      body: [
        'if s == 0 {',
        ' return 1',
        '}',
        'if i == len(arr) || s < 0 {',
        ' return 0',
        '}',
        'return fn(i+1, s) + fn(i+1, s-arr[i])',
      ].join('\n'),
    }

    const actual = toUserCode(fnData, 'golang', true)
    const expected = [
      'var arr = []int{1,3,4,5,2,10}',
      '',
      'func _fn(i int, s int) int {',
      '  if s == 0 {',
      '   return 1',
      '  }',
      '  if i == len(arr) || s < 0 {',
      '   return 0',
      '  }',
      '  return fn(i+1, s) + fn(i+1, s-arr[i])',
      '}',
      '',
      'var memoize = true',
    ].join('\n')

    expect(actual).toEqual(expected)
  })
})
