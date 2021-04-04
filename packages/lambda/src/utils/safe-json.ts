import { debug } from 'debug'
const log = debug('app:utils')

/* FIXME: code shared between
  - lambda/src/utils/safe-json.ts
  - lambda/src/runner/operations/get-full-source-code.ts
  - web/src/utils/safe-json.ts
*/

export const safeStringify = (obj: any) => JSON.stringify(obj, replacer)
export const safeParse = (str: string) => isJson(str)? JSON.parse(str, reviver) : {}

const replacer = (_key: string, value: any) => {
  if (value === Infinity) return 'Infinity'
  if (value === -Infinity) return '-Infinity'
  if (Number.isNaN(value)) return 'NaN'
  return value
}

const reviver = (_key: string, value: any) => {
  if (value === 'Infinity') return Infinity
  if (value === '-Infinity') return -Infinity
  if (value === 'NaN') return NaN
  return value
}

export const isJson = (str: string) => {
  try {
    JSON.parse(str)
  } catch {
    log('Error to parse: %O', str)
    return false
  }
  return true
}