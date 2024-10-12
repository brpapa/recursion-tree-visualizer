import React, { useContext, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ThemeContext } from 'styled-components'

import * as consts from '../../config/consts'
import templates from '../../config/templates'
import useCarbonAds from '../../hooks/use-carbon-ads'
import useFormInput from '../../hooks/use-form-input'
import useLocalStorageState from '../../hooks/use-local-storage-state'
import { LanguageHandler } from '../../logic/language-handler'
import {
  FunctionData,
  GlobalVar,
  Language,
  Template,
} from '../../types'
import './carbon-ads.css'
import CodeEditor from './code-editor'
import * as s from './styles'
import { ThemeType } from '../../styles/themes'

const DEFAULT_LANGUAGE: Language = 'python'

const DEFAULT_FN_CODE: string = LanguageHandler.for(
  DEFAULT_LANGUAGE
).unparseFunctionData({
  body: '',
}).fnCode

const DEFAULT_GLOBAL_VARS: GlobalVar[] = []

const DEFAULT_TEMPLATE: Template = 'custom'

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
    DEFAULT_LANGUAGE
  )
  const [fnCode, setFnCode] = useLocalStorageState('fn-code', DEFAULT_FN_CODE)
  const [fnGlobalVars, setFnGlobalVars] = useLocalStorageState<GlobalVar[]>(
    'fn-global-vars',
    DEFAULT_GLOBAL_VARS
  )

  const [fnCall, setFnCall] = useFormInput(
    'fn-call',
    'fn()',
    LanguageHandler.validateFunctionCall
  )
  const [memoize, setMemoize] = useLocalStorageState('memoize', false)
  const [animate, setAnimate] = useLocalStorageState('animate', true)

  const theme = useContext(ThemeContext)!

  // if null, user changed the default code that comes in with template
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(
    DEFAULT_TEMPLATE
  )

  const divRefAds = useCarbonAds()

  const handleSelectTemplateChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newTemplate = e.target.value as Template
    setActiveTemplate(newTemplate)

    const res = LanguageHandler.for(lang).unparseFunctionData(
      templates[newTemplate].fnData[lang]
    )
    setFnCode(res.fnCode)
    setFnCall(res.fnCall)
    setFnGlobalVars(toRenderableGlobalVars(res.fnGlobalVars))
  }

  const handleSelectLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = e.target.value as Language
    setLang(newLang)

    if (activeTemplate === null) {
      // keep only the previous params names (inside fnCode)
      setFnCode(() => {
        const newest = LanguageHandler.for(newLang).unparseFunctionData({
          body: '',
        })

        return newest.fnCode
      })
    } else {
      const { fnCode, fnCall, fnGlobalVars } = LanguageHandler.for(
        newLang
      ).unparseFunctionData(templates[activeTemplate].fnData[newLang])
      setFnCode(fnCode)
      setFnCall(fnCall)
      setFnGlobalVars(toRenderableGlobalVars(fnGlobalVars))
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // client-side validation
    // TODO: remove try/catch
    try {
      const fnData = LanguageHandler.for(lang).parseFunctionData({
        fnCode,
        fnCall: fnCall.value,
        fnGlobalVars,
      }) // throw error
      onSubmit(lang, fnData, { memoize, animate })
    } catch (error: any) {
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
        {toRenderableGlobalVars(fnGlobalVars).map((globalVar, i) => (
          <s.VariableContainer key={i}>
            <CodeEditor
              lang={lang}
              value={globalVar.name}
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
              value={globalVar.value}
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
              fontSize: '14px',
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
            shouldValueChange={(prevFnCode) => {
              return LanguageHandler.for(lang).validateFunctionCode(prevFnCode)
            }}
            onValueChange={(newValue) => {
              setFnCode((prevValue) => {
                if (prevValue !== newValue) setActiveTemplate(null)
                return newValue
              })
            }}
            onValueReset={() => {
              const { fnCode } = LanguageHandler.for(lang).unparseFunctionData({
                body: '',
              })
              setFnCode(fnCode)
            }}
          />
        </div>

        <s.Title>Options</s.Title>
        <s.Option>
          <span>Step-by-step animation</span>
          <s.Switch checked={animate} onChange={() => setAnimate((p) => !p)} />
        </s.Option>
        <s.Option>
          <span>Memoization</span>
          <s.Switch checked={memoize} onChange={() => setMemoize((p) => !p)} />
        </s.Option>
        <s.Option>
          <span>Dark mode</span>
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

// para apresentacao em tela, tamanho do array é sempre 2
function toRenderableGlobalVars(globalVars: GlobalVar[]): GlobalVar[] {
  return Array(2)
    .fill(undefined)
    .map((_, i) => ({
      name: globalVars[i]?.name || '',
      value: globalVars[i]?.value || '',
    }))
}
