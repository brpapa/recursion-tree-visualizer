import useLocalStorage from './use-local-storage'

type HTMLELements = HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
type Event = React.ChangeEvent<HTMLELements>

type Return = [
  { value: string; onChange: (e: Event) => void },
  React.Dispatch<React.SetStateAction<string>>
]

// with useLocalStorage built-in
const useFormInput = (
  localStorageKey: string,
  initialValue: string,
  validate?: (value: string) => boolean
): Return => {
  const [value, setValue] = useLocalStorage(localStorageKey, initialValue)

  function handleChange(e: Event) {
    if (validate && !validate(e.target.value)) return
    setValue(e.target.value)
  }

  return [
    {
      value,
      onChange: handleChange,
    },
    setValue,
  ]
}

export default useFormInput
