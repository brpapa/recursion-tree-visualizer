import useLocalStorage from './use-local-storage'

type HTMLELements = HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement

/* with local storage persistence by default */
const useFormInput = (
  localStorageKey: string,
  initialValue: string,
  validate?: (value: string) => boolean
) => {
  const [value, setValue] = useLocalStorage(localStorageKey, initialValue)

  function onChange(e: React.ChangeEvent<HTMLELements>) {
    if (validate && !validate(e.target.value)) return
    setValue(e.target.value)
  }

  return [{ value, onChange }, setValue] as const
}

export default useFormInput
