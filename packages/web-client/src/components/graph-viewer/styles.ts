import styled from 'styled-components'
import { ReactComponent as Logo } from './../../assets/icons/logo.svg'

export const Container = styled.div`
  flex-grow: 1;
  
  height: calc(100% - 1.6em);
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.foreground};
  border-radius: 8px;
  box-shadow: 10px 10px 50px rgb(120, 120, 120, 0.05);

  display: flex;
  flex-direction: column;
`

export const LogoIcon = styled(Logo)`
  width: 100%;
  height: 100%;
  padding: 5em;
  color: ${({ theme }) => theme.colors.contrast};
  opacity: 0.03;
`