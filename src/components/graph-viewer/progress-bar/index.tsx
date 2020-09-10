import React from 'react'
import { Container, Bar } from './styles'

type Props = {
  progress: number // between 0 and 1
  // label?: string
}

const ProgressBar = ({ progress }: Props) => {
  return (
    <Container>
      <Bar widthPercent={Math.min(progress, 1) * 100} />
    </Container>
  )
}

export default ProgressBar
