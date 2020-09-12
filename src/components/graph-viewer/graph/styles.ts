import styled from 'styled-components'

export const Svg = styled.svg`
  flex: 1; /* aumenta o height para o máximo que couber */
  border-radius: 0 0 8px 8px;
  background-color: ${({ theme }) => theme.colors.foreground};
`
