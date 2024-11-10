import React from 'react'
import styled from 'styled-components'

const Footer = () => {
  return (
    <StyledFooter>
      Made with &#9829; by Bruno Papa{'  '}•{'  '}
      <a
        href='https://github.com/brpapa/recursion-tree-visualizer'
        target='__blank'
      >
        Github
      </a>
    </StyledFooter>
  )
}

export default Footer

export const StyledFooter = styled.footer`
  font-size: 0.8em;
  flex-grow: 0;
  text-align: center;
  margin-top: 0.5em;

  opacity: 0.35;
  color: ${({ theme }) => theme.colors.contrast};
  a {
    color: ${({ theme }) => theme.colors.contrast};
  }
`
