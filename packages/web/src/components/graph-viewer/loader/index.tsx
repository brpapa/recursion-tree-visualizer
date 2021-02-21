import React from 'react'
import styled, {keyframes } from 'styled-components'

const skRotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`
const skBounce = keyframes`
  0%, 100% {
    transform: scale(0.0);
  } 
  50% {
    transform: scale(1.0);
  }
`
const Spinner = styled.div`
  margin: auto;
  width: 30px;
  height: 30px;
  position: relative;
  text-align: center;
  animation: ${skRotate} 2s infinite linear;
`
const Dot = styled.div`
  width: 60%;
  height: 60%;
  display: inline-block;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.contrast};
  border-radius: 100%;
  animation: ${skBounce} 2s infinite ease-in-out;
`
const Dot1 = styled(Dot)`
  top: 0;
`
const Dot2 = styled(Dot)`
  top: auto;
  bottom: 0;
  animation-delay: -1.0s;
`

const Loader = () => {
  return (
    <Spinner>
      <Dot1 />
      <Dot2 />
    </Spinner>
  )
}
export default Loader


