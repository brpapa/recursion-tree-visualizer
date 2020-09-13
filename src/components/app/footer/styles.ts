import styled from 'styled-components'

export const Footer = styled.footer`
  font-size: 0.8em;
  flex-grow: 0;
  text-align: center;
  margin-top: 0.5em;

  color: ${({ theme: { colors } }) => colors.contrast};
  color: gray;
  a {
    color: gray;
  }
`
