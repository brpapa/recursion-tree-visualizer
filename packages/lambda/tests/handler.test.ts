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
    [{ body: '{"lang": "node", "functionData": {}}' }],
  ])('Should return 400, case %#', async (event: any) => {
    const result = await handler(event, {} as any, () => {})
    expect(result).toBeDefined()
    if (result) {
      log('Parsed result body: %O', JSON.parse(result.body))
      expect(result.statusCode).toEqual(400)
    }
  })

  it.each([
    [
      {
        body:
          '{"lang": "node","functionData": {"globalVariables": [{"name": "arr","value": "[1,3,4,5,2,10]"}],"params": [{"name": "i","initialValue": "0"},{"name": "s","initialValue": "7"}],"body": "if (s == 0) return 1; if (i == arr.length || s < 0) return 0; return fn(i+1, s) + fn(i+1, s-arr[i])"},"options": {"memoize": false}}',
      },
    ],
    [
      {
        body:
          '{\n' +
          '  "lang": "node",\n' +
          '  "functionData": {\n' +
          '    "globalVariables": [\n' +
          '        { "name": "v", "value": "[100,70,50,10]" },\n' +
          '        { "name": "w", "value": "[10,4,6,12]" }\n' +
          '      ],\n' +
          '      "params": [\n' +
          '        { "name": "i", "initialValue": "0" },\n' +
          '        { "name": "s", "initialValue": "12" }\n' +
          '      ],\n' +
          '      "body": "if (s < 0) return -Infinity\\nif (i == v.length) return 0\\n\\nreturn Math.max(\\n  fn(i+1, s),\\n  v[i] + fn(i+1, s-w[i])\\n)"\n' +
          '  },\n' +
          '  "options": {\n' +
          '    "memoize": false\n' +
          '  }\n' +
          '}',
      },
    ],
    [
      {
        body:
          '{"lang": "python","functionData": {"globalVariables": [{ "name": "v", "value": "[100,70,50,10]" },{ "name": "w", "value": "[10,4,6,12]" }],"params": [{ "name": "i", "initialValue": "0" },{ "name": "s", "initialValue": "12" }],"body": "if (s < 0): return -math.inf\\nif (i == len(v)): return 0\\n\\nreturn max(\\nfn(i+1, s),\\nv[i] + fn(i+1, s-w[i])\\n)"},"options": {"memoize": false}}',
      },
    ],
  ])('Should return 200, case %#', async (event: any) => {
    const result = await handler(event, {} as any, () => {})
    expect(result).toBeDefined()
    if (result) {
      expect(result.statusCode).toEqual(200)
    }
  })

  it.each([
    [
      {
        body:
          '{"lang": "node","functionData": {"globalVariables": [{"name": "arr","value": "[1,3,4,5,2,10]"}],"params": [{"name": "i","initialValue": "0"},{"name": "s","initialValue": "7"}],"body": "console.log(1); if (s == 0) return 1; if (i == arr.length || s < 0) return 0; return fn(i+1, s) + fn(i+1, s-arr[i])"},"options": {"memoize": false}}',
      },
    ],
  ])('Should return 500, case %#', async (event: any) => {
    const result = await handler(event, {} as any, () => {})
    expect(result).toBeDefined()
    if (result) {
      log('Parsed result body: %O', JSON.parse(result.body))
      expect(result.statusCode).toEqual(500)
    }
  })
})

describe('Lambda handler receiving an mocked API Gateway payload', () => {
  it.each([
    [
      {
        version: '2.0',
        routeKey: 'POST /rtv-lambda',
        rawPath: '/rtv-lambda',
        rawQueryString: '',
        headers: {
          'accept-encoding': 'gzip, deflate',
          'content-length': '462',
          'content-type': 'application/json',
          host: '8j3kgh0303.execute-api.us-east-1.amazonaws.com',
          'user-agent': 'vscode-restclient',
          'x-amzn-trace-id': 'Root=1-606a4813-1304db3410f7da9a4ec12a02',
          'x-forwarded-for': '179.157.33.8',
          'x-forwarded-port': '443',
          'x-forwarded-proto': 'https',
        },
        requestContext: {
          accountId: '775360108516',
          apiId: '8j3kgh0303',
          domainName: '8j3kgh0303.execute-api.us-east-1.amazonaws.com',
          domainPrefix: '8j3kgh0303',
          http: {
            method: 'POST',
            path: '/rtv-lambda',
            protocol: 'HTTP/1.1',
            sourceIp: '179.157.33.8',
            userAgent: 'vscode-restclient',
          },
          requestId: 'dSAzCjP7IAMEVFQ=',
          routeKey: 'POST /rtv-lambda',
          stage: '$default',
          time: '04/Apr/2021:23:13:23 +0000',
          timeEpoch: 1617578003312,
        },
        body:
          '{\n' +
          '  "lang": "node",\n' +
          '  "functionData": {\n' +
          '    "params": [\n' +
          '      { "name": "v", "initialValue": "5" }\n' +
          '    ],\n' +
          '    "globalVariables": [\n' +
          '      { "name": "coins", "value": "[1,3,4,5]" }\n' +
          '    ],\n' +
          '    "body": "  // remaining v cents\\n  \\n  if (v == 0) return 0\\n  if (v < 0) return Infinity\\n  \\n  let ans = Infinity\\n  for (const coin of coins)\\n    ans = Math.min(\\n      ans,\\n      1 + fn(v - coin)\\n    )\\n  return ans\\n"\n' +
          '  },\n' +
          '  "options": {\n' +
          '    "memoize": false\n' +
          '  }\n' +
          '}',
        isBase64Encoded: false,
      },
    ],
  ])('Should return 200, case %#', async (event: any) => {
    const result = await handler(event, {} as any, () => {})
    expect(result).toBeDefined()
    if (result) {
      expect(result.statusCode).toEqual(200)
    }
  })
})
