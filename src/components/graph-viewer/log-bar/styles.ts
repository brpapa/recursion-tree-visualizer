import styled from 'styled-components'

export const Paragraph = styled.p`
  font-size: 15px;
  flex-grow: 0;
  text-align: center;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.contrast};
`
