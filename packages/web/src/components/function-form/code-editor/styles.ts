import styled from 'styled-components'

export const Container = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.foregroundAccent};
  border-radius: 5px;
  padding: 0.3em;

  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.borderAccent};
  }
`

export const Pre = styled.pre`
  text-align: left;
  margin: 1em 0;
  padding: 0.5em;
  overflow: scroll;

  & .token-line {
    line-height: 1.3em;
    height: 1.3em;
  }
`

export const Line = styled.div`
  display: table-row;
`

export const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;
`

export const LineContent = styled.span`
  display: table-cell;
`
