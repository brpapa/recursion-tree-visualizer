import styled, { keyframes } from 'styled-components'


export const Circle = styled.circle`
  stroke-width: 5px;
`
export const Text = styled.text`
  font-size: 40px;
  font-weight: bold;
  text-anchor: middle;
  /* font-family: monospace; */
  alignment-baseline: central;
  user-select: none;
`

const backgroundColor = 'white'
const foregroundColor = 'black'

export const Container = styled.g<{ highlight: boolean }>`
  ${Circle} {
    fill: ${({ highlight }) => (highlight ? 'black' : backgroundColor)};
    stroke: ${({ highlight }) => (highlight ? 'black' : foregroundColor)};
  }

  ${Text} {
    fill: ${({ highlight }) => (highlight ? backgroundColor : foregroundColor)};
  }

  &:hover {
    ${Circle} {
      fill: ${({ theme }) => theme.colors.primary};
      stroke: ${({ theme }) => theme.colors.primary};
    }
    ${Text} {
      fill: white;
    }
  }

  /* ${Circle}, ${Text} {
    animation-name: ${keyframes`
      from {
        r: 0;
        font-size: 10px;
      }
    `};
    animation-duration: 0.6s;
    animation-duration: 0.2s;
    animation-timing-function: cubic-bezier(0.65, 0, 0.265, 1.55);
    animation-delay: both;
  } */
`
