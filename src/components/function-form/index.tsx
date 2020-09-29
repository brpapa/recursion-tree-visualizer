import React from 'react'

import * as s from './styles'
import Switch from './switch'
import CodeEditor from './code-editor'
import {
  group,
  ungroup,
  codeValidate,
  callValidate,
} from './utils'
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
    animate: boolean,
    memoVertices: number[]
  ) => void
  onThemeChange: (themeName: Themes) => void
}

const FunctionForm = ({ onSubmit, onThemeChange }: Props) => {
  const [fnCall, setFnCall] = useFormInput('fn-call', 'fn()', callValidate)
  const [fnCode, setFnCode] = useLocalStorage('fn-code', 'function fn() {\n\n}')
  const [fnVars, setFnVars] = useLocalStorage<Variable[]>('fn-vars', [
    { name: '', value: '' },
    { name: '', value: '' },
  ]) //! fixado em 2 vars por enquanto

  const [memorize, setMemorize] = useLocalStorage('memorize', false)
  const [animate, setAnimate] = useLocalStorage('animate', true)
  const [dark, setDark] = useLocalStorage('dark-mode', false)

  const [error, setError] = React.useState('')

  React.useEffect(() => {
    onThemeChange(dark ? 'dark' : 'light')
  }, [dark, onThemeChange])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value as Templates
    const res = ungroup(templates[key])

    setFnCode(res.fnCode)
    setFnCall(res.fnCall)
    setFnVars(res.fnVars)
  }
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const fnData = group(fnCode, fnCall.value, fnVars)
      const { adjList, args, result, memoVertices } = getTree(fnData, memorize) // can throw error

      setError('')
      onSubmit(adjList, args, result, animate, memoVertices)
    } catch (error) {
      // console.error(error.name, error.message)
      setError(error.message)
    }
  }

  return (
    <s.FormContainer onSubmit={handleFormSubmit}>
      <s.FormContent>
        <s.Title>Pre-defined templates</s.Title>
        <s.Select defaultValue='custom' onChange={handleSelectChange}>
          {Object.entries(templates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
        </s.Select>

        <s.Title>Global read-only variables</s.Title>
        {fnVars.map(({ name, value }, i) => (
          <s.VariableContainer key={i}>
            <CodeEditor
              value={name}
              onChange={(value) => {
                setFnVars((v) => {
                  if (v[i]) v[i].name = value
                  return [...v]
                })
              }}
            />
            <span>=</span>
            <CodeEditor
              value={value}
              onChange={(value) => {
                setFnVars((v) => {
                  if (v[i]) v[i].value = value
                  return [...v]
                })
              }}
            />
          </s.VariableContainer>
        ))}

        <s.Title>Recursive function</s.Title>
        <CodeEditor
          value={fnCode}
          onChange={setFnCode}
          validate={codeValidate}
        />

        {error !== '' && <s.Error>{error}</s.Error>}

        <s.Title>Options</s.Title>
        <s.OptionContainer>
          <span>Enable step-by-step animation</span>
          <Switch
            checked={animate}
            onChange={() => setAnimate((p) => !p)}
          />
        </s.OptionContainer>
        <s.OptionContainer>
          <span>Enable memoization</span>
          <Switch checked={memorize} onChange={() => setMemorize((p) => !p)} />
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
