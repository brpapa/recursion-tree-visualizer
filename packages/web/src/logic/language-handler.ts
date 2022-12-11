import { UnparsedFunctionData, FunctionData, Language } from '../types'
import {
  extractCallingValues,
  extractParams,
  extractStringBetweenFirstParentesis,
  ParamExtractMode,
} from './extractors'
import type { Language as PrismLanguage } from 'prism-react-renderer'

export abstract class LanguageHandler {
  unparseFunctionData(parsedFunction: FunctionData): UnparsedFunctionData {
    const fnCall = `fn(${(parsedFunction.params || [])
      .map((p) => p.initialValue)
      .join(', ')})`

    const fnGlobalVars = parsedFunction.globalVariables || []

    const fnCode = this.toFunctionCode(parsedFunction)

    return { fnCode, fnCall, fnGlobalVars }
  }

  parseFunctionData(unparsedFunction: UnparsedFunctionData): FunctionData {
    const body = this.toBody(unparsedFunction)
    const returnType = this.toReturnType(unparsedFunction)

    const paramsDeclaration = extractStringBetweenFirstParentesis(
      unparsedFunction.fnCode
    )

    const extractedParams = extractParams(
      paramsDeclaration,
      this.paramExtractMode()
    )

    const valuesDeclaration = extractStringBetweenFirstParentesis(
      unparsedFunction.fnCall
    )
    const callingValues = extractCallingValues(valuesDeclaration)

    const params = extractedParams.map((p, i) => ({
      name: p.name,
      type: p.type ?? undefined,
      initialValue: callingValues[i] ?? p.default ?? null,
    }))

    if (params.some((p) => p.initialValue === null)) {
      throw new Error('Incorrect params values')
    }

    const globalVariables = unparsedFunction.fnGlobalVars.filter(
      ({ name, value }) => name !== '' && value !== ''
    )

    return { body, returnType, params, globalVariables }
  }

  validateFunctionCode(functionCode: string) {
    return this.functionCodeRegExp().test(functionCode)
  }

  static validateFunctionCall(functionCall: string) {
    return /^fn\(.*\)$/.test(functionCall)
  }

  protected abstract toFunctionCode(parsedFunction: FunctionData): string
  protected abstract toBody(unparsedFunction: UnparsedFunctionData): string
  protected abstract toReturnType(
    unparsedFunction: UnparsedFunctionData
  ): string | undefined

  protected abstract paramExtractMode(): ParamExtractMode
  protected abstract functionCodeRegExp(): RegExp
  abstract prismLanguage(): PrismLanguage

  static for(lang: Language): LanguageHandler {
    switch (lang) {
      case 'node':
        return new NodeHandler()
      case 'python':
        return new PythonHandler()
      case 'golang':
        return new GolangHandler()
      default:
        throw new Error(`Unexpected lang, got '${lang}'`)
    }
  }
}

class NodeHandler extends LanguageHandler {
  protected toBody({ fnCode }: UnparsedFunctionData): string {
    return fnCode.substring(fnCode.indexOf('{') + 2, fnCode.lastIndexOf('}'))
  }

  protected toReturnType(_: UnparsedFunctionData): string | undefined {
    return undefined
  }

  protected toFunctionCode(parsedFunction: FunctionData): string {
    return `function fn(${(parsedFunction.params || [])
      .map((p) => p.name)
      .join(', ')}) {\n${parsedFunction.body || '  '}\n}`
  }

  protected paramExtractMode(): ParamExtractMode {
    return 'NEVER_TYPE_AND_MAYBE_DEFAULT'
  }

  protected functionCodeRegExp(): RegExp {
    return new RegExp(/^(function\s+fn\(.*\)\s+\{\n)(.*)(\n\})$/s)
  }

  prismLanguage(): PrismLanguage {
    return 'javascript'
  }
}

class PythonHandler extends LanguageHandler {
  protected toBody({ fnCode }: UnparsedFunctionData): string {
    return fnCode.slice(fnCode.indexOf(':\n') + 2)
  }

  protected toReturnType(_: UnparsedFunctionData): string | undefined {
    return undefined
  }

  protected toFunctionCode(parsedFunction: FunctionData): string {
    return `def fn(${(parsedFunction.params || [])
      .map((p) => p.name)
      .join(', ')}):\n${parsedFunction.body || '  '}`
  }

  protected paramExtractMode(): ParamExtractMode {
    return 'NEVER_TYPE_AND_MAYBE_DEFAULT'
  }

  protected functionCodeRegExp(): RegExp {
    return new RegExp(/^(def\s+fn\(.*\):\n)(.*)/s)
  }

  prismLanguage(): PrismLanguage {
    return 'python'
  }
}

class GolangHandler extends LanguageHandler {
  protected toBody({ fnCode }: UnparsedFunctionData): string {
    return fnCode.substring(fnCode.indexOf('{') + 2, fnCode.lastIndexOf('}'))
  }

  protected toReturnType({ fnCode }: UnparsedFunctionData): string | undefined {
    return fnCode.substring(fnCode.indexOf(')') + 1, fnCode.indexOf('{')).trim()
  }

  protected toFunctionCode(parsedFunction: FunctionData): string {
    return `func fn(${(parsedFunction.params || [])
      .map((p) => p.name + ' ' + p.type)
      .join(', ')}) ${parsedFunction.returnType || ''} {\n${
      parsedFunction.body || '  '
    }\n}`
  }

  protected paramExtractMode(): ParamExtractMode {
    return 'ALWAYS_TYPE_AFTER_NAME_AND_NEVER_DEFAULT'
  }

  protected functionCodeRegExp(): RegExp {
    return new RegExp(/^(func\s+fn\(.*\)\s*.*\s*\{\n)(.*)(\n\})$/s)
  }

  prismLanguage(): PrismLanguage {
    return 'go'
  }
}
