import styled, { css, keyframes } from 'styled-components'

export const Line = styled.line`
  stroke: ${({ theme }) => theme.colors.contrast};
  stroke-width: 5px;
`
export const Text = styled.text`
  font-size: 25px;
  font-weight: bold;
  text-anchor: middle;
  alignment-baseline: central;
  user-select: none;
  paint-order: stroke;
  fill: ${({theme}) => theme.colors.contrast};
  stroke: ${({theme}) => theme.colors.foreground};
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
      }
    `
  }};

  ${Line} {
    transform-box: fill-box;
    transform-origin: center;

    animation-name: ${keyframes`
      /*
      from {
        transform: scale(0);
      }
       to {
        transform: scale(1);
      } */
    `};
    animation-duration: 1s;
    animation-timing-function: ease;
    animation-delay: both;
  }
`
