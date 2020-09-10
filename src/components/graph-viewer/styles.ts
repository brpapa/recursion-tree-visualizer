import styled from 'styled-components'

export const Container = styled.div`
  height: 100%;
  width: 100%;
  border: ${({ theme }) => theme.border};
  border-radius: 8px;
  box-shadow: 10px 10px 50px rgb(120, 120, 120, 0.05);
`