const MAX_NUMBER = 1e5

export const labeledEdgeCost = (w?: number) => {
  if (w === undefined) return undefined
  if (w === Infinity) return '∞'
  if (w === -Infinity) return '-∞'
  return w > MAX_NUMBER ? w.toExponential(2) : w.toString()
}

export const labeledVerticeArgs = (verticeArgs?: any[]) => {
  if (verticeArgs === undefined) return undefined
  return verticeArgs
    .map((arg) => (arg > MAX_NUMBER ? arg.toExponential(2) : arg.toString()))
    .join(',')
}

// prettier-ignore
export const objectMap = <T, R>(
  obj: Record<string, T>,
  callbackFn: (value: T, key: string, index: number) => R
) => {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([key, value], index) => [key, callbackFn(value, key, index)]
    )
  )
}
