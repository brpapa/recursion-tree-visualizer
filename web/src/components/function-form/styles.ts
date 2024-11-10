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
    border: 1px solid ${({ theme }) => theme.colors.borderAccent};
  }
`

export const Title = styled.p`
  padding-top: 1.4em;
  padding-bottom: 0.3em;
  padding-left: 0.1em;
  font-weight: bold;
  font-size: 1.10em;
`
export const Select = styled.select`
  ${commonFormItem}
  width: 100%;
  height: 27px;
`
export const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.3em 0;
  padding-left: 0.1em;
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
  padding: ${HIGHER_HEIGHT}px 15px;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.foreground};
  border: 1px solid ${({ theme }) => theme.colors.contrast};
  border-left: none;
  font-weight: bold;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  &:focus {
    border: 0;
  }
`
export const VariableContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.4em 0;
  div {
    flex: 1 1;
    &:first-child {
      flex: 0 0;
      flex-basis: 62px;
    }
  }
`
export const FormContent = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
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

export const Switch = styled.input.attrs({ type: 'checkbox' })`
  --active: ${({ theme }) => theme.colors.primary};
  --active-inner: #fff;
  --border: ${({ theme }) => theme.colors.borderAccent};
  --background: ${({ theme }) => theme.colors.foregroundAccent};

  appearance: none;
  height: 21px;
  width: 38px;
  border-radius: 11px;
  outline: none;
  display: inline-block;
  vertical-align: top;
  position: relative;
  margin: 0;
  margin-right: 0.2em;
  cursor: pointer;
  border: 1px solid var(--bc, var(--border));
  background: var(--b, var(--background));

  &:after {
    content: '';
    display: block;
    position: absolute;
    transition: transform var(--d-t, 0.3s) var(--d-t-e, ease),
      opacity var(--d-o, 0.2s);
    left: 2px;
    top: 2px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background: var(--ab, var(--border));
    transform: translateX(var(--x, 0));
  }

  &:checked {
    --b: var(--active);
    --bc: var(--active);
    --d-o: 0.3s;
    --d-t: 0.6s;
    --d-t-e: cubic-bezier(0.2, 0.85, 0.32, 1.2);
    --ab: var(--active-inner);
    --x: 17px;
  }
`
