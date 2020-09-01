export const objectMap = <T, R>(
  obj: Record<string, T>,
  fn: (value: T, key: string, index: number) => R
) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value], index) => [
      key,
      fn(value, key, index),
    ])
  )
