import styled, { css } from 'styled-components'

export const Line = styled.line`
  /* stroke: ${(props) => props.stroke}; */
  stroke-width: 5px;
`
export const Text = styled.text`
  font-size: 25px;
  font-weight: bold;
  text-anchor: middle;
  alignment-baseline: central;
  user-select: none;

  paint-order: stroke;
  stroke: #fff;
  stroke-width: 10px;
  stroke-linecap: round;
  stroke-linejoin: round;
`
export const Container = styled.g<{ highlight: boolean }>`
  ${({ highlight, theme }) => {
    const color = highlight ? theme.colors.primary : 'black'

    return css`
      fill: ${color};
      ${Line} {
        stroke: ${color};
      }
    `
  }};
`
