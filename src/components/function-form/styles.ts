import styled, { css } from 'styled-components'

const withFormItemBase = css`
  font-size: 15px;
  background-color: ${({ theme }) => theme.colors.foreground};
  border: 1px solid transparent;
  border: ${({ theme }) => theme.border};
  border-radius: 5px;
  &:focus {
    outline: none;
    border: ${({ theme }) => theme.borderAccent};
  }
`
/**/
export const Label = styled.p`
  padding-top: 10px;
  padding-bottom: 3px;
  padding-left: 5px;
`
export const FormContainer = styled.form`
  width: 500px;
  height: 100%;
  padding: 10px;
`
export const Select = styled.select`
  ${withFormItemBase}
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 6px;
`
export const Textarea = styled.textarea`
  ${withFormItemBase}
  font-family: Menlo, monospace;
  resize: none;
  display: block;
  height: 200px;
  width: 100%;
  padding: 7px;
`
export const TextInput = styled.input.attrs({ type: 'text' })`
  ${withFormItemBase}
  font-family: Menlo, monospace;
  padding: 4px 5px; /* !height equal */
  margin: 3px;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textPlaceholder};
  }
`
export const Button = styled.button`
  ${withFormItemBase}
  padding: 4px 8px; /* !height equal */
  background-color: black;
  border: 0;
  color: white;
  font-weight: bold;
  &:focus {
    border: 0;
  }
`
export const Divider = styled.hr`
  border: ${({ theme }) => theme.border};
  margin: 15px 50px;
`
export const Error = styled.p`
  border-radius: 5px;
  margin-top: 15px;
  padding: 2px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
`
/**/
export const FunctionContainer = styled.div`
  position: relative;
`
export const VariableContainer = styled.div`
  display: flex;
  align-items: center;
  ${TextInput} {
    flex-grow: 1;
    &:first-child {
      width: 70px;
      flex-grow: 0;
    }
  }
`
export const RunContainer = styled.div`
  display: flex;
  align-items: center;
  ${TextInput} {
    flex-grow: 1;
  }
  ${Button} {
    flex-grow: 0;
  }
`
