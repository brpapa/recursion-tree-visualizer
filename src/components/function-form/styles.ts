import styled, { css } from 'styled-components'
import { ReactComponent as Logo } from './../../assets/icons/logo.svg'

const HEIGHT = 4

const commonFormItem = css`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.foregroundAccent};
  border: 1px solid transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.borderAccent};
  }
`
export const LogoIcon = styled(Logo)`
  width: 50px;
  height: 50px;
  color: ${({theme}) => theme.colors.contrast};
`
export const Form = styled.form`
  background-color: ${({ theme }) => theme.colors.foreground};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 0.9em;
`
export const Label = styled.p`
  padding-top: 1.4em;
  padding-bottom: 0.2em;
  padding-left: 0.1em;
`
export const Title = styled.h1`
  padding-bottom: 10px;
`
export const Select = styled.select`
  ${commonFormItem}
  width: 100%;
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
export const TextInput = styled.input.attrs({ type: 'text' })<{
  primary?: boolean
}>`
  ${commonFormItem}
  font-family: ${({ theme }) => theme.fonts.mono};
  padding: ${({ primary }) => HEIGHT + (primary ? 2 : 0)}px 5px;
  margin: 3px;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textPlaceholder};
  }
`
export const Button = styled.button<{ primary?: boolean }>`
  ${commonFormItem}
  padding: ${({ primary }) => HEIGHT + (primary ? 2 : 0)}px 10px;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.foreground};
  border: 0;
  font-weight: bold;
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
export const Variable = styled.div`
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
export const FormContent = styled.div`
  overflow: scroll;
`
export const FormSubmit = styled.div`
  display: flex;
  align-items: center;
  ${TextInput} {
    flex-grow: 1;
  }
  ${Button} {
    flex-grow: 0;
  }
`
