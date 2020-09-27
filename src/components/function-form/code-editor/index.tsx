import React from 'react'
import { ThemeContext } from 'styled-components'
import { useCodeJar } from 'react-codejar'
import Prism from 'prismjs'
import * as s from './styles'

type Props = {
  value: string
  onChange: (value: string) => void
  validate?: (text: string) => boolean
}

const CodeEditor = ({ value, onChange, validate }: Props) => {
  const [code, setCode] = React.useState(value)
  const theme = React.useContext(ThemeContext)

  const divRef = useCodeJar({
    code,
    options: { tab: ' '.repeat(2) },
    style: {},
    onUpdate: (code: string) => {
      if (validate && !validate(code)) {
        // hack para react achar que mudou e re-renderizar
        setCode((prev) =>
          prev[prev.length - 1] == '}'
            ? prev + ' '
            : prev.slice(0, prev.length - 1)
        )
      } else {
        setCode(code)
        onChange(code)
      }
    },
    highlight: (editor: HTMLElement) => {
      const text = editor.textContent as string
      const language = Prism.languages.javascript
      editor.innerHTML = Prism.highlight(text, language, 'js')
      return {}
    },
  })

  React.useEffect(() => {
    setCode(value)
  }, [value])

  React.useEffect(() => {
    if (!divRef?.current) return
    divRef.current.style.resize = 'none'
  }, [divRef])

  React.useEffect(() => {
    const linkEl = document.createElement('link')
    linkEl.setAttribute('rel', 'stylesheet')
    linkEl.setAttribute('type', 'text/css')
    linkEl.setAttribute('href', `/prism-${theme.name}.css`)
    document.head.appendChild(linkEl)

    return () => {
      document.head.removeChild(linkEl)
    }
  }, [theme.name])

  return <s.Container ref={divRef}/>
}

export default CodeEditor
