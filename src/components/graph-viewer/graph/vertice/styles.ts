import styled, { keyframes } from 'styled-components'

export const Circle = styled.circle`
  stroke-width: 5px;
`
export const Text = styled.text`
  font-size: 40px;
  font-weight: bold;
  text-anchor: middle;
  alignment-baseline: central;
  user-select: none;
`
export const Container = styled.g<{ highlight: boolean }>`
  ${Circle} {
    fill: ${({ highlight, theme }) =>
      highlight ? theme.colors.primary : theme.colors.foreground};
    stroke: ${({ highlight, theme }) =>
      highlight ? theme.colors.primary : theme.colors.contrast};
  }
  ${Text} {
    fill: ${({ highlight, theme }) =>
      highlight ? '#fff' : theme.colors.contrast};
  }

  &:hover {
    ${Circle} {
      fill: ${({ theme }) => theme.colors.primary};
      stroke: ${({ theme }) => theme.colors.primary};
    }
    ${Text} {
      fill: ${({ theme }) => theme.colors.foreground};
    }
  }

  ${Circle}, ${Text} {
    animation-name: ${keyframes`
      from {
        r: 0;
        font-size: 0;
      }
    `};
    animation-duration: 0.2s;
    animation-timing-function: cubic-bezier(0.65, 0, 0.265, 1.55);
    animation-delay: both;
  }
`
