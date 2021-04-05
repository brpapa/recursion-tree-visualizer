import styled from 'styled-components'

export const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  
  flex-direction: column;
  ${({theme}) => theme.devices.desktop} {
    flex-direction: row;
  }
`
export const Sidebar = styled.div`
  height: 100vh;
  
  width: 100%;
  ${({theme}) => theme.devices.desktop} {
    width: 390px;
  }
`
export const Main = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  padding: 0.8em;
  height: 100vh;
`