import React from 'react'
import styled from 'styled-components'

type Props = {
  text: string
}

const LogBar = ({ text }: Props) => {
  return <Paragraph>{text}</Paragraph>
}

export default LogBar

const Paragraph = styled.p`
  font-size: 15px;
  flex-grow: 0;
  text-align: center;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.mono};
  color: ${({ theme }) => theme.colors.primary};
`
