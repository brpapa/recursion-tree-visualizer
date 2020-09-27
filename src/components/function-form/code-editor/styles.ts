import styled, { css } from 'styled-components'

export const Container = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.foregroundAccent};
  border-radius: 5px;
  padding: 0.3em;

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.borderAccent};
  }
`
