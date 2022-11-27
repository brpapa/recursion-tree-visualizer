import { Either, error, success } from '../lib/either'
import { safeParse, safeStringify } from '../static/safe-json'
import { FunctionData, Language, TreeViewerData } from '../types'
import { API_URL } from './consts'

type RequestBody = {
  lang: Language
  functionData: FunctionData
  options: {
    memoize: boolean
  }
}

export const fetchTreeViewerData = async (
  requestBody: RequestBody
): Promise<Either<string, TreeViewerData>> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: safeStringify(requestBody),
    })
    const responseBody = await response.text()

    if (response.ok) {
      const treeViewerData = safeParse(responseBody) as TreeViewerData
      return success(treeViewerData)
    } else {
      const err = safeParse(responseBody) as { reason: string }
      return error(err.reason || 'Internal server error')
    }
  } catch (e) {
    console.error(e)
    return error('Unexpected error')
  }
}
