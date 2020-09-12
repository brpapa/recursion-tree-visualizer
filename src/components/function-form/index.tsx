import React from 'react'
import * as styles from './styles'
import { group, ungroup, codeValidate, callValidate } from './utils'
import templates from './templates'
import useFormInput from './../../hooks/use-form-input'
import useLocalStorage from './../../hooks/use-local-storage'
import getTree from '../../core/get-tree'
import { Templates, AdjList, Args, Variable } from '../../types'

type Props = {
  onSubmit: (adjList: AdjList, args: Args, result: number) => void
}

const FunctionForm = ({ onSubmit }: Props) => {
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
  const [memorize, setMemorize] = React.useState(false) // DOING
  const [error, setError] = React.useState('')

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
    <styles.FormContainer onSubmit={handleSubmit}>
      <styles.FormMain>
        <styles.Select defaultValue='custom' onChange={handleSelectChange}>
          {Object.entries(templates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
          <option value='custom'>Custom</option>
        </styles.Select>

        <styles.Label>Recursive function:</styles.Label>
        <styles.Textarea {...fnCode} rows={10} cols={50} />

        <styles.Label>Global read-only variables:</styles.Label>
        {fnVars.map(({ name, value }, i) => (
          <styles.VariableContainer key={i}>
            <styles.TextInput
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
            <styles.TextInput
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
          </styles.VariableContainer>
        ))}

        <styles.Label>Options:</styles.Label>
        <input type='checkbox' onChange={() => setMemorize((p) => !p)}/>
        {'  '}Memorize

        {error !== '' && <styles.Error>{error}</styles.Error>}
      </styles.FormMain>

      <styles.FormSubmit>
        <styles.RunContainer>
          <styles.TextInput {...fnCall} />
          <styles.Button type='submit'>run</styles.Button>
        </styles.RunContainer>
      </styles.FormSubmit>
    </styles.FormContainer>
  )
}

export default FunctionForm
