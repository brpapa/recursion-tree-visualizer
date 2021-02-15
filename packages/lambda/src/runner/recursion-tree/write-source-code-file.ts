import path from 'path'
import fs from 'fs/promises'
import { SupportedLanguages } from './../../types'

const DIR_PATH = path.join(__dirname, '..', '..', 'tmp')

/** Write the generated source code into file system. Returns your absolute file path. */
export default async function writeSourceCodeFile(
  content: string,
  lang: SupportedLanguages
): Promise<string> {
  const filePath = path.join(DIR_PATH, fileName(lang))

  try {
    const p = await fs.mkdir(DIR_PATH, { recursive: true })
    console.log('repository created at ' + p)
    await fs.writeFile(filePath, content, 'utf8')
    console.log('file created')
  } catch (e) {
    console.log('error')
    console.log(e)
    throw new Error(
      `File system error: fail to write the source code file at ${filePath}`
    )
  }

  return filePath
}

const fileName = (lang: SupportedLanguages) => {
  if (lang === 'node') return '_code.js'
  if (lang === 'python') return '_code.py'
  if (lang === 'cpp') return '_code.cpp'
  return '_code'
}
