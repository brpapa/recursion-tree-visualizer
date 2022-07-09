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
  const { body } = buildFnCodeDecomposer(lang)(fnCode)

  const paramsDeclaration = extractContentInsideFirstParentesis(fnCode)
  const paramsWithDefault = getParams(paramsDeclaration)

  const valuesDeclaration = extractContentInsideFirstParentesis(fnCall)
  const paramsCallingValues = getParamsCallingValues(valuesDeclaration)

  const params = paramsWithDefault.map((p, i) => ({
    name: p.name,
    initialValue: paramsCallingValues[i] ?? p.default ?? null,
  }))

  if (params.some((p) => p.initialValue === null)) {
    throw new Error('Incorrect params values')
  }

  const globalVariables = fnGlobalVars.filter(
    ({ name, value }) => name !== '' && value !== ''
  )

  return { params, body, globalVariables }
}

export const buildFnCodeDecomposer = (lang: Language) => {
  switch (lang) {
    case 'node':
      return (fnCode: string) => ({
        body: fnCode.substring(
          fnCode.indexOf('{') + 2,
          fnCode.lastIndexOf('}')
        ),
      })
    case 'python':
      return (fnCode: string) => ({
        body: fnCode.slice(fnCode.indexOf(':\n') + 2),
      })
  }
}

export const buildFnCodeComposer = (lang: Language) => {
  switch (lang) {
    case 'node':
      return (fnCode?: { body?: string; paramsNames?: string[] }) =>
        `function fn(${(fnCode?.paramsNames || []).join(',')}) {\n${
          fnCode?.body || '  '
        }\n}`
    case 'python':
      return (fnCode?: { body?: string; paramsNames?: string[] }) =>
        `def fn(${(fnCode?.paramsNames || []).join(',')}):\n${
          fnCode?.body || '  '
        }`
  }
}

export const getParams = (
  paramsDeclaration: string
): { name: string; default: string | null }[] => {
  const specialChars = [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' },
  ]

  let curr = ''
  let currIsDefault = false
  const stack: string[] = [] // where the target close chars are stacking of the currParam
  const paramsName: string[] = []
  const paramsDefault: (string | null)[] = []

  const chars = paramsDeclaration.trim().split('').concat('\n')
  chars.forEach((c) => {
    const cIsEqualChar = c === '='
    if (cIsEqualChar) {
      paramsName.push(curr)
      curr = ''
      currIsDefault = true
      return
    }

    const specialChar = specialChars.find(({ open }) => open === c)
    const cIsOpenChar = specialChar !== undefined

    if (cIsOpenChar) {
      curr += c
      stack.push(specialChar!.close)
      return
    }

    const cIsCloseChar = stack.length > 0 && c === stack[stack.length - 1]
    if (cIsCloseChar) {
      stack.pop()
      curr += c
      if (stack.length === 0) {
        paramsDefault.push(currIsDefault ? curr : null)
        curr = ''
      }
      return
    }

    const cIsSeparatorChar = c === ',' && stack.length === 0
    if (cIsSeparatorChar) {
      if (curr !== '') {
        if (!currIsDefault) paramsName.push(curr)
        paramsDefault.push(currIsDefault ? curr : null)
        curr = ''
      }
      currIsDefault = false
      return
    }

    const cIsEndChar = c === '\n'
    if (cIsEndChar) {
      if (curr !== '') {
        if (!currIsDefault) paramsName.push(curr)
        paramsDefault.push(currIsDefault ? curr : null)
      }
      return
    }

    curr += c
  })

  return paramsDefault.map((p, i) => ({
    name: paramsName[i]?.trim(),
    default: p === null ? null : p.trim(),
  }))
}

export const getParamsCallingValues = (valuesDeclaration: string): string[] => {
  const specialChars = [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' },
  ]

  let curr = ''
  const stack: string[] = [] // where the target close chars are stacking of the currParam
  const params: string[] = []

  const chars = valuesDeclaration.trim().split('').concat('\n')
  chars.forEach((c) => {
    const specialChar = specialChars.find(({ open }) => open === c)
    const cIsOpenChar = specialChar !== undefined

    if (cIsOpenChar) {
      curr += c
      stack.push(specialChar!.close)
      return
    }

    const cIsCloseChar = stack.length > 0 && c === stack[stack.length - 1]
    if (cIsCloseChar) {
      stack.pop()
      curr += c
      if (stack.length === 0) {
        params.push(curr)
        curr = ''
      }
      return
    }

    const cIsSeparatorChar = c === ',' && stack.length === 0
    if (cIsSeparatorChar) {
      if (curr !== '') {
        params.push(curr)
        curr = ''
      }
      return
    }

    const cIsEndChar = c === '\n'
    if (cIsEndChar) {
      if (curr !== '') params.push(curr)
      return
    }

    curr += c
  })

  return params.map((p) => p.trim())
}

export const extractContentInsideFirstParentesis = (fnCode: string) => {
  let curr = ''
  const stack: string[] = []

  const chars = fnCode.split('')
  for (const c of chars) {
    if (c === '(') {
      curr += c
      stack.push(')')
      continue
    }

    const cIsCloseChar = c === stack[stack.length - 1]
    if (cIsCloseChar) {
      stack.pop()
      if (stack.length === 0) {
        curr += c
        break
      }
    }

    curr += c
  }

  return curr.substring(curr.indexOf('(') + 1, curr.lastIndexOf(')'))
}
