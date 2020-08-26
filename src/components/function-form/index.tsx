// TODO: experimentar https://react-hook-form.com/
// TODO: https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
// TODO: não permitir selecionar parte do textarea 'bloqueada'
// TODO: apresentar erros de validação do form ao usuário
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
} from './styles'
import { group, ungroup, codeValidate, callValidate } from './utils'
import templates from './templates'
import useFormInput from './../../hooks/use-form-input'
import { FunctionData, TemplateKeys } from '../../types'

type Props = {
  onSubmit: (fnData: FunctionData) => void
}

const FunctionForm = (props: Props) => {
  const [fnCode, setFnCode] = useFormInput('function fn() {\n\n}', codeValidate)
  const [fnCall, setFnCall] = useFormInput('fn()', callValidate)

  //! fixado em 2 vars
  const [vars, setVars] = React.useState([
    { name: '', value: '' },
    { name: '', value: '' },
  ])

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

    const fnData = group(fnCode.value, fnCall.value, vars)
    props.onSubmit(fnData)
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Label>Recursive function:</Label>
      <FunctionContainer>
        <Select defaultValue='custom' onChange={handleSelectChange}>
          <option value='fibonacci'>Fibonacci</option>
          <option value='knapsack'>Knapsack</option>
          <option value='custom'>Custom</option>
        </Select>
        <Textarea {...fnCode} rows={10} cols={50} />
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
    </FormContainer>
  )
}

export default FunctionForm
