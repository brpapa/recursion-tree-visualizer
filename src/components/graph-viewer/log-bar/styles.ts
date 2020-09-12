import styled from 'styled-components'

export const Paragraph = styled.p`
  margin: 5px 10px;
  font-size: 14px;
  /* font-weight: bold; */
  flex: 0;
  text-align: center;
  color ${({ theme: { colors } }) => colors.primary};
`
