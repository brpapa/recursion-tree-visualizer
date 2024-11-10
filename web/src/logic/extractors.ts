export type ExtractedParam = {
  name: string
  type: string | null
  default: string | null
}

export type ParamExtractMode =
  | 'NEVER_TYPE_AND_MAYBE_DEFAULT'
  | 'ALWAYS_TYPE_AFTER_NAME_AND_NEVER_DEFAULT'

export const extractParams = (
  paramsDeclaration: string,
  mode: ParamExtractMode
): ExtractedParam[] => {
  if (mode === 'ALWAYS_TYPE_AFTER_NAME_AND_NEVER_DEFAULT') {
    return paramsDeclaration.trim() === ''
      ? []
      : paramsDeclaration.split(',').map((p) => {
          const [name, type] = p.trim().split(' ')
          return {
            name: name,
            type: type,
            default: null,
          }
        })
  }
  if (mode === 'NEVER_TYPE_AND_MAYBE_DEFAULT') {
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
      type: null,
      default: p === null ? null : p.trim(),
    }))
  }
  return []
}

export const extractCallingValues = (valuesDeclaration: string): string[] => {
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

export const extractStringBetweenFirstParentesis = (fnCode: string) => {
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
