import { Template, FunctionData, Language } from '../types'
import { templates as staticTemplates } from '../static/templates'

type TemplateData = { name: string; fnData: Record<Language, FunctionData> }

const templates: Record<Template, TemplateData> = {
  custom: {
    name: 'Custom',
    fnData: {
      node: {
        body: '  // type your own code here',
      },
      python: {
        body: '  # type your own code here',
      },
    },
  },
  ...staticTemplates,
}

export default templates
