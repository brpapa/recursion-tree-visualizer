import { Language } from "../../types"

export const buildFnCodeValidator = (lang: Language) => {
  switch (lang) {
    case 'node':
      // return (s: string) => /^(function\s+fn\(.*\)\s+\{)(.*)(\n\})$/s.test(s)
      return (s: string) => {
        console.log('node', s)
        const res = /^(function\s+fn\(.*\)\s+\{)(.*)(\n\})$/s.test(s)
        console.log(res)
        return res
      }
    case 'python':
      // return (s: string) => /^(def\s+fn\(.*\):\n)(.*)/s.test(s)
      return (s: string) => {
        console.log('python', s)
        const res = /^(def\s+fn\(.*\):\n)(.*)/s.test(s)
        console.log(res)
        return res
      }
  }
}
export const buildFnCallValidator = (lang: Language) => {
  switch (lang) {
    case 'node':
    case 'python':
      return (s: string) => /^(fn\(.*\))$/.test(s)
  }
}
