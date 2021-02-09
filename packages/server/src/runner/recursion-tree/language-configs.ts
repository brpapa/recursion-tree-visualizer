import { SupportedLanguages } from 'src/types'

export const languageConfigs = (
  filePath: string
): Record<SupportedLanguages, any> => ({
  node: { cmd: `node ${filePath}`, isCompiled: false },
  python: { cmd: `python3 ${filePath}`, isCompiled: false },
  cpp: { cmd: ``, isCompiled: false },
})
