import React from 'react'
import { Paragraph } from './styles'

type Props = {
  text: string
}

const LogBar = ({ text }: Props) => {
  return <Paragraph>{text}</Paragraph>
}

export default LogBar
