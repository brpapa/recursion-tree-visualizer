import React from 'react'
import * as S from './styles'
import { group, ungroup, codeValidate, callValidate } from './utils'
import templates from './templates'
import useFormInput from './../../hooks/use-form-input'
import useLocalStorage from './../../hooks/use-local-storage'
import getTree from '../../core/get-tree'
import { Templates, AdjList, Args, Variable, Themes } from '../../types'

type Props = {
  onSubmit: (adjList: AdjList, args: Args, result: number) => void
  onThemeChange: (themeKey: Themes) => void
}

const FunctionForm = ({ onSubmit, onThemeChange }: Props) => {
  const [fnCode, setFnCode] = useFormInput(
    'fn-code',
    'function fn() {\n\n}',
    codeValidate
  )
  const [fnCall, setFnCall] = useFormInput('fn-call', 'fn()', callValidate)
  const [fnVars, setFnVars] = useLocalStorage<Variable[]>('fn-vars', [
    { name: '', value: '' },
    { name: '', value: '' },
  ]) //! fixado em 2 vars por enquanto

  const [memorize, setMemorize] = useLocalStorage('memorize', false)
  const [dark, setDark] = useLocalStorage('dark-mode', false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    onThemeChange(dark ? 'dark' : 'light')
  }, [dark, onThemeChange])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'custom') return

    const key = e.target.value as Templates
    const res = ungroup(templates[key])

    setFnCode(res.fnCode)
    setFnCall(res.fnCall)
    setFnVars(res.fnVars)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const fnData = group(fnCode.value, fnCall.value, fnVars)
      const { adjList, args, result } = getTree(fnData, memorize)

      setError('')
      onSubmit(adjList, args, result)
    } catch (error) {
      // console.error(error.name, error.message)
      setError(error.message)
    }
  }

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.FormContent>
        <S.LogoIcon/>
        {/* <S.Title>Recursion tree visualizer</S.Title> */}
        <S.Label>Template:</S.Label>
        <S.Select defaultValue='custom' onChange={handleSelectChange}>
          {Object.entries(templates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
          <option value='custom'>Custom</option>
        </S.Select>
        <S.Label>Recursive function:</S.Label>
        <S.Textarea {...fnCode} rows={10} cols={50} />
        <S.Label>Global read-only variables:</S.Label>
        {fnVars.map(({ name, value }, i) => (
          <S.Variable key={i}>
            <S.TextInput
              placeholder='name'
              value={name}
              onChange={(e) => {
                const varName = e.target.value

                setFnVars((v) => {
                  if (v[i]) v[i].name = varName
                  return [...v]
                })
              }}
            />
            <span>=</span>
            <S.TextInput
              placeholder='value'
              value={value}
              onChange={(e) => {
                const varValue = e.target.value

                setFnVars((v) => {
                  if (v[i]) v[i].value = varValue
                  return [...v]
                })
              }}
            />
          </S.Variable>
        ))}
        <S.Label>Options:</S.Label>
        <input
          type='checkbox'
          checked={memorize}
          onChange={() => setMemorize((p) => !p)}
        />
        {'  '}Memorize states
        <br />
        <input
          type='checkbox'
          checked={dark}
          onChange={() => setDark((p) => !p)}
        />
        {'  '}Enable dark mode
        {error !== '' && <S.Error>{error}</S.Error>}
      </S.FormContent>

      <S.FormSubmit>
        <S.TextInput primary {...fnCall} />
        <S.Button primary type='submit'>
          run
        </S.Button>
      </S.FormSubmit>
    </S.Form>
  )
}

export default FunctionForm
