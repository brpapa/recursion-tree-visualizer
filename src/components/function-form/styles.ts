import styled, { css } from 'styled-components'

// form item
const HEIGHT = 4
const HIGHER_HEIGHT = 6

const commonFormItem = css`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.foregroundAccent};
  border: 1px solid ${({ theme }) => theme.colors.border};
  /* border: 1px solid transparent; */
  border-radius: 5px;
  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.borderAccent};
  }
`

export const P = styled.p`
  padding-top: 1.4em;
  padding-bottom: 0.2em;
  padding-left: 0.1em;
`
export const Select = styled.select`
  ${commonFormItem}
  width: 100%;
  height: 27px;
`
export const Textarea = styled.textarea`
  ${commonFormItem}
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.mono};
  resize: none;
  display: block;
  height: 200px;
  width: 100%;
  padding: ${HEIGHT}px 5px;
`
export const CheckBoxInput = styled.input.attrs({ type: 'checkbox' })``
export const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.2em 0;

  ${CheckBoxInput} {
    margin: 0.3em;
  }

  span {
    margin-left: 0.4em;
  }
`
export const TextInput = styled.input.attrs({ type: 'text' })`
  ${commonFormItem}
  font-family: ${({ theme }) => theme.fonts.mono};
  padding: ${HEIGHT}px 5px;
  margin: 3px;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textPlaceholder};
  }
`
export const Button = styled.button`
  ${commonFormItem}
  padding: ${HEIGHT}px 10px;
`
export const SubmitTextInput = styled(TextInput)`
  padding: ${HIGHER_HEIGHT}px 5px;
  margin: 0;
  /* border: 1px solid ${({ theme }) => theme.colors.contrast};; */
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
`
export const SubmitButton = styled(Button).attrs({ type: 'submit' })`
  padding: ${HIGHER_HEIGHT}px 10px;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.foreground};
  /* border: 1px solid transparent; */
  border: 0;
  font-weight: bold;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  &:focus {
    border: 0;
  }
`
export const Error = styled.p`
  border-radius: 5px;
  margin-top: 15px;
  padding: 2px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
`
export const VariableContainer = styled.div`
  display: flex;
  align-items: center;
  ${TextInput} {
    flex: 1 1;
    &:first-child {
      width: 70px;
      flex: 0 0;
    }
  }
`
export const FormContent = styled.div`
  overflow: scroll;
  padding: 0.9em;
`
export const FormSubmit = styled.div`
  display: flex;
  align-items: center;
  padding: 0.7em;

  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${TextInput} {
    flex-grow: 1;
  }
  ${Button} {
    flex-grow: 0;
  }
`
export const FormContainer = styled.form`
  background-color: ${({ theme }) => theme.colors.foreground};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`