import styled from 'styled-components'

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
`
export const Circle = styled.circle`
  fill: white;

`
export const Group = styled.g<{ color: string }>`
  fill: ${(props) => props.color};
  ${Line} {
    stroke: ${(props) => props.color};
  }
`
