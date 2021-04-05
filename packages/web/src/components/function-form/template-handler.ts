import { FunctionData, Language } from '../../types'

export const decomposeFnData = (fnData: FunctionData, lang: Language) => {
  const { params, body, globalVariables } = fnData

  const paramsNames = (params || []).map(({ name }) => name)
  const paramsInitialValues = (params || []).map(
    ({ initialValue }) => initialValue
  )

  const composeFnCode = buildFnCodeComposer(lang)

  const var1 = globalVariables && globalVariables[0]
  const var2 = globalVariables && globalVariables[1]

  return {
    fnCode: composeFnCode({ body, paramsNames }),
    fnCall: `fn(${paramsInitialValues.join(',')})`,
    fnGlobalVars: [
      { name: var1?.name || '', value: var1?.value || '' },
      { name: var2?.name || '', value: var2?.value || '' },
    ],
  }
}

export const composeFnData = (
  fnCode: string,
  fnCall: string,
  fnGlobalVars: { name: string; value: string }[],
  lang: Language
): FunctionData => {
  const { body, paramsNames } = buildFnCodeDecomposer(lang)(fnCode)
  const paramsValues = getParamsValues(fnCall)

  if (paramsNames.length !== paramsValues.length)
    throw new Error('Incorrect params values')

  const params = paramsNames.map((paramName, i) => ({
    name: paramName,
    initialValue: paramsValues[i],
  }))

  const globalVariables = fnGlobalVars.filter(
    ({ name, value }) => name !== '' && value !== ''
  )

  return { params, body, globalVariables }
}

export const buildFnCodeDecomposer = (lang: Language) => {
  switch (lang) {
    case 'node':
      return (fnCode: string) => {
        return ({
          body: fnCode.substring(fnCode.indexOf('{') + 2, fnCode.lastIndexOf('}')),
          paramsNames: getParamsNames(fnCode),
        })
      }
    case 'python':
      return (fnCode: string) => ({
        body: fnCode.slice(fnCode.indexOf(':\n') + 2),
        paramsNames: getParamsNames(fnCode),
      })
  }
}
export const buildFnCodeComposer = (lang: Language) => {
  switch (lang) {
    case 'node':
      return (fnCode?: { body?: string; paramsNames?: string[] }) =>
        `function fn(${(fnCode?.paramsNames || []).join(',')}) {\n${fnCode?.body || '  '}\n}`
    case 'python':
      return (fnCode?: { body?: string; paramsNames?: string[] }) =>
        `def fn(${(fnCode?.paramsNames || []).join(',')}):\n${fnCode?.body || '  '}`
  }
}

const getParamsNames = (fnCode: string) => {
  const namesDeclaration = fnCode.substring(fnCode.indexOf('(') + 1, fnCode.indexOf(')'))
  const names = namesDeclaration === '' ? [] : namesDeclaration.split(/\s*,\s*/)
  return names
}

// TODO: unit tests
// 'fn((1,2))' should return ['(1,2)']
// 'fn([1,2],[1])' should return ['[1,2]', '[1]']
// 'fn({1,2},1)' should return ['{1,2}', 1]
// 'fn([1,[2,3]],1)' should return ['[1,[2,3]]', '1']
const getParamsValues = (fnCall: string) => {
  const valuesDeclaration = fnCall
    .substring(fnCall.indexOf('(') + 1, fnCall.lastIndexOf(')'))
    .replace(/\s*/g, '')
  
  const specialChars = [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' },
  ]

  let value = ''
  const targetCloseCharsStack: string[] = []
  const values: string[] = []

  valuesDeclaration.split('').forEach((char) => {
    const specialChar = specialChars.find(c => c.open === char)
    if (specialChar) {
      value += char
      targetCloseCharsStack.push(specialChar.close)
    } else {
      if (
        targetCloseCharsStack.length > 0 &&
        char === targetCloseCharsStack[targetCloseCharsStack.length - 1]
      ) {
        targetCloseCharsStack.pop()
        value += char
        if (targetCloseCharsStack.length === 0) {
          values.push(value)
          value = ''
        }
      } else if (char === ',' && targetCloseCharsStack.length === 0) {
        if (value !== '') {
          values.push(value)
          value = ''
        }
      } else {
        value += char
      }
    }
  })
  if (value !== '') values.push(value)

  return values
}
