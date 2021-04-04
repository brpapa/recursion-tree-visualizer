import { SupportedLanguages } from './types'

require('dotenv').config()

export const environment = String(process.env.NODE_ENV) || 'production'
export const supportedLanguages: SupportedLanguages[] = ['node', 'python']
