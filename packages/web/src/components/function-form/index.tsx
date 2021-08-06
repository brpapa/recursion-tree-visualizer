import React, { useContext, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { toast } from 'react-hot-toast'

import * as s from './styles'
import CodeEditor from './code-editor'
import { buildFnCodeValidator, buildFnCallValidator } from './validators'
import {
  buildFnCodeDecomposer,
  buildFnCodeComposer,
  composeFnData,
  decomposeFnData,
} from './template-handler'
import templates from '../../config/templates'
import useFormInput from '../../hooks/use-form-input'
import useCarbonAds from '../../hooks/use-carbon-ads'
import useLocalStorageState from '../../hooks/use-local-storage-state'
import {
  Template,
  ThemeType,
  FunctionData,
  Language,
  GlobalVar,
} from '../../types'
import './carbon-ads.css'
import * as consts from '../../config/consts'

type Props = {
  onSubmit: (
    lang: Language,
    fnData: FunctionData,
    options: { memoize: boolean; animate: boolean }
  ) => void
  onThemeChange: (themeType: ThemeType) => void
}

const FunctionForm = ({ onSubmit, onThemeChange }: Props) => {
  const [lang, setLang] = useLocalStorageState<Language>(
    'fn-lang',
    consts.DEFAULT_LANGUAGE
  )
  const [fnCall, setFnCall] = useFormInput(
    'fn-call',
    'fn()',
    buildFnCallValidator(lang)
  )
  const [fnCode, setFnCode] = useLocalStorageState('fn-code', consts.DEFAULT_FN_CODE)
  const [fnGlobalVars, setFnGlobalVars] = useLocalStorageState<GlobalVar[]>(
    'fn-global-vars',
    consts.DEFAULT_GLOBAL_VARS
  )

  const [memoize, setMemoize] = useLocalStorageState('memoize', false)
  const [animate, setAnimate] = useLocalStorageState('animate', true)

  const theme = useContext(ThemeContext)

  // if null, user changed the default code that comes in with template
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(
    consts.DEFAULT_TEMPLATE
  )

  const divRefAds = useCarbonAds()

  const handleSelectTemplateChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newTemplate = e.target.value as Template
    setActiveTemplate(newTemplate)

    const res = decomposeFnData(templates[newTemplate].fnData[lang], lang)
    setFnCode(res.fnCode)
    setFnCall(res.fnCall)
    setFnGlobalVars(res.fnGlobalVars)
  }

  const handleSelectLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = e.target.value as Language
    setLang(newLang)

    if (activeTemplate === null) {
      // keep only the previous params names (inside fnCode)
      setFnCode((prevFnCode) => {
        const decomposeFnCode = buildFnCodeDecomposer(lang)
        const composeFnCode = buildFnCodeComposer(newLang)

        const { paramsNames } = decomposeFnCode(prevFnCode)
        return composeFnCode({ paramsNames })
      })
    } else {
      const { fnCode, fnCall, fnGlobalVars } = decomposeFnData(
        templates[activeTemplate].fnData[newLang],
        newLang
      )
      setFnCode(fnCode)
      setFnCall(fnCall)
      setFnGlobalVars(fnGlobalVars)
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // client-side validation
    // TODO: remover try/catch
    try {
      const fnData = composeFnData(fnCode, fnCall.value, fnGlobalVars, lang) // throw error
      onSubmit(lang, fnData, { memoize, animate })
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <s.FormContainer onSubmit={handleFormSubmit}>
      <s.FormContent>
        <div ref={divRefAds} />

        <s.Title>Pre-defined templates</s.Title>
        <s.Select
          value={activeTemplate || 'custom'}
          onChange={handleSelectTemplateChange}
        >
          {Object.entries(templates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
        </s.Select>

        <s.Title>Global variables</s.Title>
        {fnGlobalVars.map(({ name, value }, i) => (
          <s.VariableContainer key={i}>
            <CodeEditor
              lang={lang}
              value={name}
              onValueChange={(value) => {
                setFnGlobalVars((v) => {
                  if (v[i]) v[i].name = value
                  return [...v]
                })
              }}
            />
            <span style={{ margin: '0 0.3em' }}>=</span>
            <CodeEditor
              lang={lang}
              value={value}
              onValueChange={(value) => {
                setFnGlobalVars((v) => {
                  if (v[i]) v[i].value = value
                  return [...v]
                })
              }}
            />
          </s.VariableContainer>
        ))}

        <s.Title>Recursive function</s.Title>
        <div style={{ position: 'relative' }}>
          <s.Select
            value={lang}
            onChange={handleSelectLanguageChange}
            style={{
              position: 'absolute',
              top: '-27px',
              right: '0',
              width: '80px',
              height: '22px',
              fontSize: '14px'
            }}
          >
            {consts.LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </s.Select>
          <CodeEditor
            lang={lang}
            value={fnCode}
            shouldValueChange={buildFnCodeValidator(lang)}
            onValueChange={(newValue) => {
              setFnCode((prevValue) => {
                if (prevValue !== newValue) setActiveTemplate(null)
                return newValue
              })
            }}
            onValueReset={() => {
              const composeFnCode = buildFnCodeComposer(lang)
              setFnCode(composeFnCode())
            }}
          />
        </div>

        <s.Title>Options</s.Title>
        <s.Option>
          <span>Enable step-by-step animation</span>
          <s.Switch checked={animate} onChange={() => setAnimate((p) => !p)} />
        </s.Option>
        <s.Option>
          <span>Enable memoization</span>
          <s.Switch checked={memoize} onChange={() => setMemoize((p) => !p)} />
        </s.Option>
        <s.Option>
          <span>Enable dark mode</span>
          <s.Switch
            checked={theme.type === 'dark'}
            onChange={() =>
              onThemeChange(theme.type === 'light' ? 'dark' : 'light')
            }
          />
        </s.Option>
      </s.FormContent>

      <s.FormSubmit>
        <s.SubmitTextInput {...fnCall} />
        <s.SubmitButton>Run</s.SubmitButton>
      </s.FormSubmit>
    </s.FormContainer>
  )
}

export default FunctionForm
