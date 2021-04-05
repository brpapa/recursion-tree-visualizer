import { Language } from "../../types"

export const buildFnCodeValidator = (lang: Language) => {
  switch (lang) {
    case 'node':
      return (s: string) => /^(function\s+fn\(.*\)\s+\{)(.*)(\n\})$/s.test(s)
    case 'python':
      return (s: string) => /^(def\s+fn\(.*\):\n)(.*)/s.test(s)
  }
}
export const buildFnCallValidator = (lang: Language) => {
  switch (lang) {
    case 'node':
    case 'python':
      return (s: string) => /^(fn\(.*\))$/.test(s)
  }
}
