import styled from 'styled-components'

export const AppContainer = styled.div`
  display: flex;
  align-items: center;

  width: 100vw;
  height: 100vh;
  padding: 5px;

  background-color: ${({ theme }) => theme.colors.background};
`
