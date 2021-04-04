import { debug } from 'debug'
const log = debug('app:utils:safe-json')

/* FIXME: code shared between (ESSA EH A FONTE DA VERDADE)
  - lambda/src/utils/safe-json.ts
  - lambda/src/runner/operations/get-full-source-code.ts
  - web/src/utils/safe-json.ts
*/

export const safeStringify = (obj: any) => JSON.stringify(obj, replacer)
export const safeParse = (str: string) => isJson(str)? JSON.parse(sanitizate(str), reviver) : {}

export const isJson = (str: string) => {
  const sanitizated = sanitizate(str)
  try {
    JSON.parse(sanitizated, reviver)
  } catch {
    log('Error to parse: %O', sanitizated)
    return false
  }
  return true
}

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

const sanitizate = (jsonString: string) =>
  jsonString
    .replace(/,\s*]/g, ']')
    .replace(/,\s*}/g, '}')