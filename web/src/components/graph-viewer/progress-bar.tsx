import React from 'react'
import styled from 'styled-components'

import { FirstIcon } from '../../icons/first'
import { LastIcon } from '../../icons/last'
import { NextIcon } from '../../icons/next'
import { PreviousIcon } from '../../icons/previous'

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

const BORDER = 8
const HEIGHT = 14

export const Container = styled.div`
  /* border-bottom: 1px solid ${({ theme }) => theme.colors.border}; */
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 7px 7px 0 0;
  padding: 7px;
`
export const WrapperBar = styled.div`
  flex-grow: 1;
  margin: 0 5px 0 5px;
  border-radius: ${BORDER}px;
  height: ${HEIGHT}px;
  background-color: ${({ theme }) => theme.colors.backgroundAccent};
  cursor: pointer;
`
export const Bar = styled.div<{ widthPercent: number }>`
  border-radius: ${({ widthPercent }) =>
    widthPercent === 100
      ? `${BORDER - 2}px`
      : `${BORDER - 2}px 0 0 ${BORDER - 2}px`};
  height: 100%;
  background-color: ${({ theme }) => theme.colors.text};
  width: ${({ widthPercent }) => widthPercent}%;
  transition: width 0.2s;
`
export const Button = styled.button`
  background-color: transparent;
  border: none;
  margin: 0 4px;
  cursor: pointer;
  outline: none;
  display: flex;
  svg {
    color: ${({ theme }) => theme.colors.contrast};
    width: ${HEIGHT + 4}px;
    height: ${HEIGHT + 4}px;
  }
`