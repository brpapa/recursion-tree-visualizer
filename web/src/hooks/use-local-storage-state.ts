import React from 'react'

type Return<T> = [T, React.Dispatch<React.SetStateAction<T>>]

const isBrowser = typeof window !== 'undefined'

const useLocalStorageState = <T>(key: string, initialValue: T): Return<T> => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (!isBrowser) return initialValue

    const value = localStorage.getItem(key)
    // prettier-ignore
    return value
      ? JSON.parse(value)
      : initialValue instanceof Function
        ? initialValue()
        : initialValue
  })

  React.useEffect(() => {
    if (!isBrowser) return

    localStorage.setItem(key, JSON.stringify(storedValue))
  }, [storedValue, key])

  return [storedValue, setStoredValue]
}

export default useLocalStorageState
