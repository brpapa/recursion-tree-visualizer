import { FunctionData } from './../types'
import translateToPlainCode from './plain-code'

describe('Translate function data to plain code in Node.js', () => {
  test('Should get the correct plain code from function data', () => {
    const fnData: FunctionData = {
      variables: [{ name: 'arr', value: '[1,3,4,5,2,10]' }],
      params: [
        { name: 'i', value: '0' },
        { name: 's', value: '7' },
      ],
      body: [
        'if (s == 0) return 1',
        'if (i == arr.length || s < 0) return 0',
        '',
        'return fn(i+1, s) + fn(i+1, s-arr[i])',
      ].join('\n'),
      memoize: false
    }

    const plainCode = translateToPlainCode(fnData)
    expect(plainCode).toEqual(
      [
        'const arr = [1,3,4,5,2,10]',
        '',
        'function _fn(i, s) {',
        '  if (s == 0) return 1',
        '  if (i == arr.length || s < 0) return 0',
        '  ',
        '  return fn(i+1, s) + fn(i+1, s-arr[i])',
        '}',
        '',
        'const fnParamsValues = [0, 7]',
        'const memoize = false',
      ].join('\n')
    )
  })
})
