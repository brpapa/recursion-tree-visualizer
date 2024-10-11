import React from 'react'

import { Container, Button, WrapperBar, Bar } from './styles'
import { FirstIcon } from './../../../icons/first'
import { LastIcon } from './../../../icons/last'
import { NextIcon } from '../../../icons/next'
import { PreviousIcon } from './../../../icons/previous'

type Props = {
  value: number
  onChange: (value: number) => void
  onNext: () => void
  onPrevious: () => void
  onLast: () => void
  onFirst: () => void
}

const ProgressBar = ({
  value,
  onChange,
  onNext,
  onPrevious,
  onLast,
  onFirst,
}: Props) => {
  if (isNaN(value) || value < 0 || value > 1)
    throw new Error('Invalid value props')

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const newValue = relativeX / rect.width
    onChange(newValue)
  }

  return (
    <Container>
      <Button onClick={() => onFirst()}>
        <FirstIcon />
      </Button>
      <Button onClick={() => onPrevious()}>
        <PreviousIcon />
      </Button>
      <WrapperBar onClick={handleClick}>
        <Bar widthPercent={value * 100} />
      </WrapperBar>
      <Button onClick={() => onNext()}>
        <NextIcon />
      </Button>
      <Button onClick={() => onLast()}>
        <LastIcon />
      </Button>
    </Container>
  )
}

export default ProgressBar
