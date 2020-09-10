import styled from 'styled-components'

export const Container = styled.div`
  border-radius: 7px 7px 0 0;
  padding: 0 5px 0 5px 0;
  height: 10px;
  background-color: ${({ theme }) => theme.colors.foreground};
`

export const Bar = styled.div<{ widthPercent: number }>`
  border-radius: ${({ widthPercent }) =>
    widthPercent == 100 ? '7px 7px 0 0' : '7px 0 0 0'};

  height: 80%;
  /* background-color: ${({ theme }) => theme.colors.primary}; */
  /* background-color: ${({ theme }) => theme.colors.foregroundAccent}; */
  background-color: black;
  width: ${({ widthPercent }) => widthPercent}%;
  transition: width 0.2s;
`
