import React from 'react'

type HTMLELements = HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
type Event = React.ChangeEvent<HTMLELements>

type Return = [
  { value: string; onChange: (e: Event) => void },
  React.Dispatch<React.SetStateAction<string>>
]

const useFormInput = (
  init: string,
  validate?: (value: string) => boolean
): Return => {
  const [value, setValue] = React.useState(init)

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
