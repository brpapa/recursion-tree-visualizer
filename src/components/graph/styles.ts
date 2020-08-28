import styled from 'styled-components'

export const Svg = styled.svg`
  height: 100%;
  width: 100%;
  background-color: ${({theme}) => theme.colors.foreground};
  border: ${({ theme }) => theme.border};
  border-radius: 8px;
  box-shadow: 10px 10px 50px rgb(120,120,120,0.05);
`
