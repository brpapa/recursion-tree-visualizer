import styled, { css, keyframes } from 'styled-components'

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
export const Container = styled.g<{
  highlight: 'current' | 'memoized' | 'none'
}>`
  ${({ highlight, theme }) => {
    const { foreground, contrast } = theme.colors
    const main = highlight === 'memoized' ? contrast : theme.colors.primary
    const filled = highlight !== 'none'

    return css`
      ${Circle} {
        fill: ${filled ? main : foreground};
        stroke: ${filled ? main : contrast};
      }
      ${Text} {
        fill: ${filled ? foreground : contrast};
      }
      &:hover {
        ${Circle} {
          fill: ${theme.colors.primary};
          stroke: ${theme.colors.primary};
        }
        ${Text} {
          fill: ${foreground};
        }
      }
    `
  }}

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
