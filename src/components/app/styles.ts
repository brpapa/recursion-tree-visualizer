import styled from 'styled-components'

export const App = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
`
export const Sidebar = styled.div`
  width: 350px;
`
export const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0.8em;
`