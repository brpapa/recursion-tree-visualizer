import React from 'react'
import * as S from './styles'

type Props = { link: string }

const Footer = ({ link }: Props) => {
  return (
    <S.Footer>
      Made with &#9829; by Bruno Papa{'  '}•{'  '}
      <a
        href={link}
        target='__blank'
      >
        Github
      </a>
    </S.Footer>
  )
}

export default Footer
