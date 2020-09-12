import styled from 'styled-components'

export const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 5px;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
`
export const Layout = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`
export const Footer = styled.footer`
  font-size: 0.7em;
  flex: 0;
  margin: 5px 0;
  color: ${({ theme: { colors } }) => colors.contrast};
  text-align: center;

  a {
    color: ${({ theme: { colors } }) => colors.contrast};
  }
`
