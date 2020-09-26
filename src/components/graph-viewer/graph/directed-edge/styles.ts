import styled, { css } from 'styled-components'

export const Line = styled.line`
  stroke-width: 5px;
`
export const Text = styled.text`
  font-size: 25px;
  font-weight: bold;
  text-anchor: middle;
  alignment-baseline: central;
  user-select: none;
  paint-order: stroke;
  stroke-width: 10px;
  stroke-linecap: round;
  stroke-linejoin: round;
`
export const Container = styled.g<{ highlight: boolean }>`
  ${({ highlight, theme }) => {
    const color = highlight ? theme.colors.primary : theme.colors.contrast

    return css`
      fill: ${color};
      ${Line} {
        stroke: ${color};
      }
      ${Text} {
        fill: ${color};
        stroke: ${({ theme }) => theme.colors.foreground};
      }
    `
  }};

  --pr: ${({ theme }) => theme.colors.primary};
  --fg: ${({ theme }) => theme.colors.foreground};

  &:hover {
    fill: var(--pr);
    ${Line} {
      stroke: var(--pr);
    }
    ${Text} {
      fill: var(--pr);
      stroke: var(--fg);
    }
  }
`
