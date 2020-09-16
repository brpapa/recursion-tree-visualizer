import styled from 'styled-components'

export const App = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;

  ${({theme}) => theme.devices.desktop} {
    flex-direction: row;
    width: 100vw;
    height: 100vh;
  }
`
export const Sidebar = styled.div`
  height: 100vh;
  
  width: 100%;
  ${({theme}) => theme.devices.desktop} {
    width: 350px;
  }
`
export const Main = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  margin: 0.8em;
  height: calc(100vh - 1.6em);
`