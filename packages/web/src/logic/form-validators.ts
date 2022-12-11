import { Language } from "../types"

export const fnCodeFormValidator = (lang: Language) => {
  switch (lang) {
    case 'node':
      return (fnCode: string) => /^(function\s+fn\(.*\)\s+\{\n)(.*)(\n\})$/s.test(fnCode)
    case 'python':
      return (fnCode: string) => /^(def\s+fn\(.*\):\n)(.*)/s.test(fnCode)
    case 'golang':
      return (fnCode: string) =>
        /^(func\s+fn\(.*\)\s*.*\s*\{\n)(.*)(\n\})$/s.test(fnCode)
  }
}

export const fnCallFormValidator = () => {
  return (fnCall: string) => /^fn\(.*\)$/.test(fnCall)
}
