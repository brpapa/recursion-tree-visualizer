import { SupportedLanguages } from './types'

require('dotenv').config()

export const environment = String(process.env.NODE_ENV) || 'production'
export const supportedLanguages: SupportedLanguages[] = ['node', 'python']
export const DEFAULT_TIMEOUT_MS = 5000
export const DEFAULT_MAX_RECURSIVE_CALLS = 256
