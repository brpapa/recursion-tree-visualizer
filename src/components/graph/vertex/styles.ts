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
type GroupProps = {
  backgroundColor?: string
  foregroundColor?: string
  visited?: boolean
}
export const Group = styled.g<GroupProps>`
  ${Circle} {
    fill: ${(props) =>
      props.visited ? props.foregroundColor : props.backgroundColor};
    stroke: ${(props) => props.foregroundColor};
  }

  ${Text} {
    fill: ${(props) =>
      props.visited ? props.backgroundColor : props.foregroundColor};
  }

  &:hover {
    ${Circle} {
      fill: ${({theme}) => theme.colors.primary};
      stroke: ${({theme}) => theme.colors.primary};
    }
    ${Text} {
      fill: white;
    }
  }

  ${Circle}, ${Text} {
    animation-name: ${keyframes`
      from {
        r: 0;
        font-size: 10px;
      }
    `};
    animation-duration: 0.6s;
    /* essa curva de bezier está perfeita :) */
    animation-timing-function: cubic-bezier(0.65, 0, 0.265, 1.55);
    animation-delay: both;
  }
`
