import { FunctionData, SupportedLanguages } from '../../types'

export default function translateToPlainCode(
  fnData: FunctionData,
  lang: SupportedLanguages,
  options: { memoize: boolean }
) {
  const declare = declareBuilder(lang)

  const globalVarLines = (fnData.globalVariables || []).map((param) =>
    declare.variable(param.name, param.value)
  )

  const paramsNames = (fnData.params || []).map((param) => param.name)
  const paramsInitialValues = (fnData.params || []).map(
    (param) => param.initialValue
  )

  const plainCode = [
    ...globalVarLines,
    '',
    declare.function('_fn', paramsNames, fnData.body),
    '',
    declare.variable('fnParamsValues', declare.array(paramsInitialValues)),
    declare.variable('memoize', declare.boolean(options.memoize)),
  ].join('\n')

  return plainCode
}

/** HOC to build a declare function, that outputs a declaration (string) for the specified language */
const declareBuilder = (lang: SupportedLanguages) => ({
  variable: (name: string, value: string) => {
    switch (lang) {
      case 'node':
        return `const ${name} = ${value}`
      case 'python':
        return `${name} = ${value}`
      default:
        return ''
    }
  },
  boolean: (value: boolean) => {
    switch (lang) {
      case 'node':
        return value === true ? 'true' : 'false'
      case 'python':
        return value === true ? 'True' : 'False'
      default:
        return ''
    }
  },
  array: (values: string[]) => {
    switch (lang) {
      case 'node':
      case 'python':
        return `[${values.join(', ')}]`
      default:
        return ''
    }
  },
  function: (name: string, params: string[], body: string) => {
    switch (lang) {
      case 'node':
        return [
          `function ${name}(${params.join(', ')}) {`,
          indentedLines(body),
          '}',
        ].join('\n')
      case 'python':
        return [`def ${name}(${params.join(', ')}):`, indentedLines(body)].join(
          '\n'
        )
      default:
        return ''
    }
  },
})

const indentedLines = (code: string) =>
  code
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')
