import { describe, it, expect } from '@jest/globals'
import { handler } from '../src/index'
import { debug } from 'debug'

const log = debug('test:handler')

describe('Lambda handler receiving an event object', () => {
  it.each([
    [{}],
    [{ body: 'hey' }],
    [{ body: '{"message": "hello world"}' }],
    [{ body: '{"lang": "rust"}' }],
    [{ body: '{"lang": "node", "functionData": {}}' }]
  ])(
    'Should return 400, case %#',
    async (event: any) => {
      const result = await handler(event, {} as any, () => {})
      expect(result).toBeDefined()
      if (result) {
        log('Parsed result body: %O', JSON.parse(result.body))
        expect(result.statusCode).toEqual(400)
      }
    }
  )
    
  it.skip.each([
    [{ body: '{\"lang\": \"node\",\"functionData\": {\"globalVariables\": [{\"name\": \"arr\",\"value\": \"[1,3,4,5,2,10]\"}],\"params\": [{\"name\": \"i\",\"initialValue\": \"0\"},{\"name\": \"s\",\"initialValue\": \"7\"}],\"body\": \"if (s == 0) return 1; if (i == arr.length || s < 0) return 0; return fn(i+1, s) + fn(i+1, s-arr[i])\"},\"options\": {\"memoize\": false}}' }],

    [
      {
        body:
          '{\n' +
          '  "lang": "node",\n' +
          '  "functionData": {\n' +
          '    "globalVariables": [\n' +
          '        { "name": "v", "value": "[100,70,50,10]" },\n' +
          '        { "name": "w", "value": "[10,4,6,12]" },\n' +
          '      ],\n' +
          '      "params": [\n' +
          '        { "name": "i", "initialValue": "0" },\n' +
          '        { "name": "s", "initialValue": "12" },\n' +
          '      ],\n' +
          '      "body": "if (s < 0) return -Infinity\\nif (i == v.length)) return 0\\n\\nreturn max(\\n  fn(i+1, s),\\n  v[i] + fn(i+1, s-w[i])\\n)"\n' +
          '  },\n' +
          '  "options": {\n' +
          '    "memoize": false\n' +
          '  }\n' +
          '}',
      },
    ],

    [{ body: '{\"lang\": \"python\",\"functionData\": {\"globalVariables\": [{ \"name\": \"v\", \"value\": \"[100,70,50,10]\" },{ \"name\": \"w\", \"value\": \"[10,4,6,12]\" },],\"params\": [{ \"name\": \"i\", \"initialValue\": \"0\" },{ \"name\": \"s\", \"initialValue\": \"12\" },],\"body\": \"if (s < 0): return -math.inf\\nif (i == len(v)): return 0\\n\\nreturn max(\\nfn(i+1, s),\\nv[i] + fn(i+1, s-w[i])\\n)\"},\"options\": {\"memoize\": false}}' }],
  ])(
    'Should return 200, case %#',
    async (event: any) => {
      const result = await handler(event, {} as any, () => {})
      expect(result).toBeDefined()
      if (result) {
        expect(result.statusCode).toEqual(200)
      }
    }
  )
})
