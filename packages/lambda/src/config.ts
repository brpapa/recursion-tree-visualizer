import { SupportedLanguages } from './types'

require('dotenv').config()

export const environment = String(process.env.NODE_ENV) || 'production'
export const supportedLanguages: SupportedLanguages[] = ['node', 'python']

export const DEFAULT_TIMEOUT_MS = 5000
export const DEFAULT_MAX_RECURSIVE_CALLS = 256
export const DEFAULT_TMP_DIR_PATH = '/tmp'
export const DEFAULT_TMP_FILE_MAX_SIZE_BYTES = 512e6 // 512 MB: size of ephemeral storage (/tmp folder) available through the AWS Lambda