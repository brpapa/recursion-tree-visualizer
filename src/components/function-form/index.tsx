import React from 'react'
import {
  Divider,
  Textarea,
  TextInput,
  Select,
  FunctionContainer,
  VariableContainer,
  RunContainer,
  FormContainer,
  Label,
  Button,
  Error,
} from './styles'
import { group, ungroup, codeValidate, callValidate } from './utils'
import templates from './templates'
import useFormInput from './../../hooks/use-form-input'
import { buildTree } from '../../core/build-tree'
import { TemplateKeys, AdjList, Variable } from '../../types'

type Props = {
  onSubmit: (adjList: AdjList, args: any[][]) => void
}

const FunctionForm = (props: Props) => {
  const [fnCode, setFnCode] = useFormInput('function fn() {\n\n}', codeValidate)
  const [fnCall, setFnCall] = useFormInput('fn()', callValidate)
  const [vars, setVars] = React.useState<Variable[]>([
    { name: '', value: '' },
    { name: '', value: '' },
  ]) //! fixado em 2 vars por enquanto
  const [error, setError] = React.useState('')

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'custom') return

    const key: TemplateKeys = e.target.value as TemplateKeys
    const res = ungroup(templates[key])

    setFnCode(res.fnCode)
    setFnCall(res.fnCall)
    setVars(res.vars)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const fnData = group(fnCode.value, fnCall.value, vars)
      const { adjList, args } = buildTree(fnData)

      setError('')
      props.onSubmit(adjList, args)
    } catch (error) {
      console.error(error.name, error.message)
      setError(error.message)
    }
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Label>Recursive function:</Label>
      <FunctionContainer>
        <Select defaultValue='custom' onChange={handleSelectChange}>
          <option value='fibonacci'>Fibonacci</option>
          <option value='knapsack'>Knapsack</option>
          <option value='coinChange'>Coin Change</option>
          <option value='fastPower'>Fast Power</option>
          <option value='custom'>Custom</option>
        </Select>
        <Textarea {...fnCode} rows={10} cols={50} wrap='off' />
      </FunctionContainer>

      <Label>Global variables:</Label>
      {vars.map(({ name, value }, i) => (
        <VariableContainer key={i}>
          <TextInput
            placeholder='name'
            value={name}
            onChange={(e) => {
              const varName = e.target.value

              setVars((v) => {
                if (v[i]) v[i].name = varName
                return [...v]
              })
            }}
          />
          <span>=</span>
          <TextInput
            placeholder='value'
            value={value}
            onChange={(e) => {
              const varValue = e.target.value

              setVars((v) => {
                if (v[i]) v[i].value = varValue
                return [...v]
              })
            }}
          />
        </VariableContainer>
      ))}

      <Divider />

      <RunContainer>
        <TextInput {...fnCall} />
        <Button type='submit'>run</Button>
      </RunContainer>

      {error !== '' && <Error>{error}</Error>}
    </FormContainer>
  )
}

export default FunctionForm
