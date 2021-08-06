import React from 'react'

type Return<T> = [T, React.Dispatch<React.SetStateAction<T>>]

const useLocalStorageState = <T>(key: string, initialValue: T): Return<T> => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    const value = localStorage.getItem(key)
    // prettier-ignore
    return value
      ? JSON.parse(value)
      : initialValue instanceof Function
        ? initialValue()
        : initialValue
  })

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue))
  }, [storedValue, key])

  return [storedValue, setStoredValue]
}

export default useLocalStorageState