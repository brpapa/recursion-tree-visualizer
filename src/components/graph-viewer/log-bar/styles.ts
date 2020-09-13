import styled from 'styled-components'

export const Paragraph = styled.p`
  margin-bottom: 0.5em;
  font-size: 14px;
  flex-grow: 0;
  text-align: center;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.primary};
`
