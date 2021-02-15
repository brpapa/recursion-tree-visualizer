import { FunctionData } from './../types'

export default function translateToPlainCode(fnData: FunctionData, options?: any) {
  const globalVarLines =
    fnData.variables?.map((param) => `const ${param.name} = ${param.value}`) ||
    []

  const paramsNames = fnData.params.map((param) => param.name).join(', ')
  const paramsValues = fnData.params.map((param) => param.value).join(', ')

  const plainCode = [
    ...globalVarLines,
    '',
    `function _fn(${paramsNames}) {`,
    ...indentedLines(fnData.body),
    '}',
    '',
    `const fnParamsValues = [${paramsValues}]`,
    `const memoize = ${options?.memoize? 'true' : 'false'}`,
  ].join('\n')

  return plainCode
}

const indentedLines = (code: string) =>
  code.split('\n').map((line) => `  ${line}`)
