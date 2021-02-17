import { FunctionData } from '../../types'

export const codeValidate = (s: string) =>
  /^(function\s+fn\(.*\)\s+\{\n).*(\}\s*)$/s.test(s)

// export const constValidate = (s: string) => /^(const\s+).*\s*=\s*.*/.test(s)
export const callValidate = (s: string) => /^(fn\(.*\))$/.test(s)

const getParams = (s: string) => {
  const content = s.substring(s.indexOf('(') + 1, s.indexOf(')'))
  return content === '' ? [] : content.split(',')
}

/** fnData => fnCode, fnCall, fnVars */
export const ungroup = (fnData: FunctionData) => {
  const { params, body, globalVariables } = fnData

  const paramsNames = params.map(({ name }) => name).join(',')
  const paramsInitialValues = params
    .map(({ initialValue }) => initialValue)
    .join(',')

  const var1 = globalVariables && globalVariables[0]
  const var2 = globalVariables && globalVariables[1]

  return {
    fnCode: `function fn(${paramsNames}) {\n${body}\n}`,
    fnCall: `fn(${paramsInitialValues})`,
    fnGlobalVars: [
      { name: var1?.name || '', value: var1?.value || '' },
      { name: var2?.name || '', value: var2?.value || '' },
    ],
  }
}

/** fnCode, fnCall, fnVars => fnData */
export const group = (
  fnCode: string,
  fnCall: string,
  fnGlobalVars: { name: string; value: string }[]
): FunctionData => {
  const paramsNames = getParams(fnCode)
  const paramsValues = getParams(fnCall)

  if (paramsNames.length !== paramsValues.length)
    throw new Error('Incorrect params values')

  const params = paramsNames.map((paramName, i) => ({
    name: paramName,
    initialValue: paramsValues[i],
  }))
  const body = fnCode.substring(
    fnCode.indexOf('{') + 1,
    fnCode.lastIndexOf('}')
  )
  const globalVariables = fnGlobalVars.filter(
    ({ name, value }) => name !== '' && value !== ''
  )

  return { params, body, globalVariables }
}
