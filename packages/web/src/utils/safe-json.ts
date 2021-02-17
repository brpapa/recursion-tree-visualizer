/* code shared between
  - lambda/src/utils/safe-json.ts
  - lambda/src/runner/operations/get-full-source-code.ts
  - web/src/utils/safe-json.ts
*/

export const safeStringify = (obj: any) => JSON.stringify(obj, replacer)
export const safeParse = (text: string) => JSON.parse(text, reviver)

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
