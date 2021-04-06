import { buildFnCodeComposer } from "../components/function-form/template-handler";
import { GlobalVar, Language, Template, ThemeType } from "../types";

export const DEFAULT_THEME_TYPE: ThemeType = 'light'
export const DEFAULT_LANGUAGE: Language = 'python'
export const DEFAULT_TEMPLATE: Template = 'custom'
export const DEFAULT_GLOBAL_VARS: GlobalVar[] = [
  { name: '', value: '' },
  { name: '', value: '' },
]
export const DEFAULT_FN_CODE = buildFnCodeComposer(DEFAULT_LANGUAGE)()

export const LANGUAGES: Language[] = ['node', 'python']
