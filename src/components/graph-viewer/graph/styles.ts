import styled from 'styled-components'

export const Svg = styled.svg`
  border-radius: 0 0 8px 8px;
  height: calc(100% - 10px); /* FIXME: Height of progress bar */
  width: 100%;
  background-color: ${({ theme }) => theme.colors.foreground};
`
