import styled from 'styled-components'

export const Container = styled.div`
  height: 100%;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.foreground};
  border-radius: 8px;
  box-shadow: 10px 10px 50px rgb(120, 120, 120, 0.05);

  display: flex;
  flex-direction: column;
`