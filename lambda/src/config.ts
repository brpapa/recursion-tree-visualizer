import { SupportedLanguages } from './types'

require('dotenv').config()

export const supportedLanguages: SupportedLanguages[] = ['node', 'python', 'golang']

export const DEFAULT_TIMEOUT_MS = 28000
export const DEFAULT_MAX_RECURSIVE_CALLS = 256
export const DEFAULT_TMP_DIR_PATH = '/tmp'
export const DEFAULT_TMP_FILE_MAX_SIZE_BYTES = 384e6 // because the size of ephemeral storage (/tmp folder) configured on AWS Lambda function is 512*10^6 bytes