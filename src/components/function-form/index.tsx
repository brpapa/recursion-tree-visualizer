import React from 'react'

import * as s from './styles'
import Switch from './switch'
import CodeEditor from './code-editor'
import { group, ungroup, codeValidate, constValidate, callValidate } from './utils'
import templates from './templates'
import useFormInput from './../../hooks/use-form-input'
import useLocalStorage from './../../hooks/use-local-storage'
import getTree from '../../core/get-tree'
import { Templates, AdjList, Args, Variable, Themes } from '../../types'

type Props = {
  onSubmit: (
    adjList: AdjList,
    args: Args,
    result: number,
    animation: boolean
  ) => void
  onThemeChange: (themeName: Themes) => void
}

const FunctionForm = ({ onSubmit, onThemeChange }: Props) => {
  const [fnCode, setFnCode] = useLocalStorage('fn-code', 'function fn() {\n\n}')
  const [fnCall, setFnCall] = useFormInput('fn-call', 'fn()', callValidate)
  const [fnVars, setFnVars] = useLocalStorage<Variable[]>('fn-vars', [
    { name: '', value: '' },
    { name: '', value: '' },
  ]) //! fixado em 2 vars por enquanto

  const [memorize, setMemorize] = useLocalStorage('memorize', false)
  const [dark, setDark] = useLocalStorage('dark-mode', false)
  const [animation, setAnimation] = useLocalStorage('animation', true)
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
    const root = document.getElementById('root')
    if (root) root.scrollIntoView()

    try {
      const fnData = group(fnCode, fnCall.value, fnVars)
      const { adjList, args, result } = getTree(fnData, memorize)

      setError('')
      onSubmit(adjList, args, result, animation)
    } catch (error) {
      // console.error(error.name, error.message)
      setError(error.message)
    }
  }

  return (
    <s.FormContainer onSubmit={handleSubmit}>
      <s.FormContent>
        <s.P>Pre-defined templates</s.P>
        <s.Select defaultValue='custom' onChange={handleSelectChange}>
          {Object.entries(templates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
          <option value='custom'>Custom</option>
        </s.Select>

        <s.P>Recursive function</s.P>
        <CodeEditor
          value={fnCode}
          onChange={setFnCode}
          validate={codeValidate}
        />
        {/* <s.Textarea value={fnCode} rows={10} cols={50} /> */}

        {error !== '' && <s.Error>{error}</s.Error>}

        <s.P>Global read-only constants</s.P>
        {fnVars.map(({ name, value }, i) => (
          <s.VariableContainer key={i}>
            <s.TextInput
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
            <s.TextInput
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
          </s.VariableContainer>
        ))}

        <s.P>Options</s.P>
        <s.OptionContainer>
          <span>Memorize states (DP)</span>
          <Switch checked={memorize} onChange={() => setMemorize((p) => !p)} />
        </s.OptionContainer>
        <s.OptionContainer>
          <span>Show step-by-step animation</span>
          <Switch
            checked={animation}
            onChange={() => setAnimation((p) => !p)}
          />
        </s.OptionContainer>
        <s.OptionContainer>
          <span>Enable dark mode</span>
          <Switch checked={dark} onChange={() => setDark((p) => !p)} />
        </s.OptionContainer>
      </s.FormContent>

      <s.FormSubmit>
        <s.SubmitTextInput {...fnCall} />
        <s.SubmitButton>Run</s.SubmitButton>
      </s.FormSubmit>
    </s.FormContainer>
  )
}

export default FunctionForm
