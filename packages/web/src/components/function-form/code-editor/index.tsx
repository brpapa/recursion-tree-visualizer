import React, { useCallback, useContext } from 'react'
import Editor from 'react-simple-code-editor'
import Highlight, { defaultProps } from 'prism-react-renderer'
import type {
  Language as PrismLanguage,
  PrismTheme,
} from 'prism-react-renderer'
import lightTheme from 'prism-react-renderer/themes/nightOwlLight'
import darkTheme from 'prism-react-renderer/themes/nightOwl'

import { ThemeContext } from 'styled-components'
import { Language as Language, ThemeType } from '../../../types'
import * as s from './styles'

type Props = {
  lang: Language
  value: string
  onValueChange: (value: string) => void
  onValueReset?: () => void
  shouldValueChange?: (value: string) => boolean
}

const CodeEditor = ({
  lang,
  value,
  onValueChange,
  onValueReset,
  shouldValueChange,
}: Props) => {
  const theme = useContext(ThemeContext)

  const onCodeChange = useCallback(
    (newCode: string) => {
      if (onValueReset && /^(\s*)$/.test(newCode)) {
        onValueReset()
        return
      }
      
      if (!shouldValueChange || shouldValueChange(newCode))
        onValueChange(newCode)
    },
    [onValueChange, onValueReset, shouldValueChange]
  )

  const highlight = useCallback(
    (code: string) => (
      <Highlight
        {...defaultProps}
        code={code}
        theme={prismTheme[theme.type]}
        language={prismLanguage[lang]}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </>
        )}
      </Highlight>
    ),
    [lang, theme.type]
  )

  return (
    <s.Container>
      <Editor
        value={value}
        onValueChange={onCodeChange}
        highlight={highlight}
        tabSize={2}
      />
    </s.Container>
  )
}

export default CodeEditor

const prismLanguage: Record<Language, PrismLanguage> = {
  node: 'javascript',
  python: 'python',
}
const prismTheme: Record<ThemeType, PrismTheme> = {
  light: lightTheme,
  dark: darkTheme,
}
