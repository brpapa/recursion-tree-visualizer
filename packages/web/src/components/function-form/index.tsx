import React from 'react'
import {toast} from 'react-hot-toast'

import * as s from './styles'
import Switch from './switch'
import CodeEditor from './code-editor'
import { group, ungroup, codeValidate, callValidate } from './utils'
import templates from '../../config/templates'
import useFormInput from '../../hooks/use-form-input'
import useCarbonAds from '../../hooks/use-carbon-ads'
import useLocalStorage from '../../hooks/use-local-storage'
import { Templates, Themes, FunctionData } from '../../types'
import './carbon-ads.css'

type Props = {
  onSubmit: (
    fnData: FunctionData,
    options: { memoize: boolean; animate: boolean }
  ) => void
  onThemeChange: (themeName: Themes) => void
}

const FunctionForm = ({ onSubmit, onThemeChange }: Props) => {
  const [fnCall, setFnCall] = useFormInput('fn-call', 'fn()', callValidate)
  const [fnCode, setFnCode] = useLocalStorage('fn-code', 'function fn() {\n\n}')
  const [fnGlobalVars, setFnGlobalVars] = useLocalStorage<
    { name: string; value: string }[]
  >('fn-global-vars', [
    { name: '', value: '' },
    { name: '', value: '' },
  ]) //! fixado em 2 vars por enquanto

  const [memoize, setMemoize] = useLocalStorage('memoize', false)
  const [animate, setAnimate] = useLocalStorage('animate', true)
  const [dark, setDark] = useLocalStorage('dark-mode', false)

  const { adsRef } = useCarbonAds()

  React.useEffect(() => {
    onThemeChange(dark ? 'dark' : 'light')
  }, [dark, onThemeChange])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value as Templates
    const res = ungroup(templates[key])

    setFnCode(res.fnCode)
    setFnCall(res.fnCall)
    setFnGlobalVars(res.fnGlobalVars)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // client-side validation
    try {
      const fnData = group(fnCode, fnCall.value, fnGlobalVars) // throw error
      onSubmit(fnData, { memoize, animate })
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <s.FormContainer onSubmit={handleFormSubmit}>
      <s.FormContent>
        <div ref={adsRef} />
        <s.Title>Pre-defined templates</s.Title>
        <s.Select defaultValue='custom' onChange={handleSelectChange}>
          {Object.entries(templates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
        </s.Select>

        <s.Title>Global read-only variables</s.Title>
        {fnGlobalVars.map(({ name, value }, i) => (
          <s.VariableContainer key={i}>
            <CodeEditor
              value={name}
              onChange={(value) => {
                setFnGlobalVars((v) => {
                  if (v[i]) v[i].name = value
                  return [...v]
                })
              }}
            />
            <span>=</span>
            <CodeEditor
              value={value}
              onChange={(value) => {
                setFnGlobalVars((v) => {
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

        <s.Title>Options</s.Title>
        <s.OptionContainer>
          <span>Enable step-by-step animation</span>
          <Switch checked={animate} onChange={() => setAnimate((p) => !p)} />
        </s.OptionContainer>
        <s.OptionContainer>
          <span>Enable memoization</span>
          <Switch checked={memoize} onChange={() => setMemoize((p) => !p)} />
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
