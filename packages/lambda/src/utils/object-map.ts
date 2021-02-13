// prettier-ignore
export const objectMap = <T, R>(
  obj: Record<string, T>,
  callback: (value: T, key: string, index: number) => R
) => {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([key, value], index) => [key, callback(value, key, index)]
    )
  )
}
