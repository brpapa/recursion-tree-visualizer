import { SupportedLanguages } from './../../types'

export const languageConfigs = (
  content: string
): Record<SupportedLanguages, any> => ({
  node: { command: `node -e "${content}"`, isCompiled: false },
  python: { command: `python3 -c "${content}"`, isCompiled: false },
  cpp: { command: ``, isCompiled: false },
})
