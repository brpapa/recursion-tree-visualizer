'use server'
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'
import { z } from 'zod'
import { safeParse } from '../static/safe-json'
import { FunctionData, Language, TreeViewerData } from '../types'

type RequestBody = {
  lang: Language
  functionData: FunctionData
  options: {
    memoize: boolean
  }
}

export default async function runFunction(body: RequestBody): Promise<
  | {
      ok: true
      value: TreeViewerData
    }
  | { ok: false; value: string }
> {
  try {
    const lambdaClient = new LambdaClient({
      region: z.string().parse(process.env.APP_AWS_REGION),
      credentials: {
        accessKeyId: z.string().parse(process.env.APP_AWS_ACCESS_KEY),
        secretAccessKey: z.string().parse(process.env.APP_AWS_SECRET_KEY),
      },
    })

    const invokeOutput = await lambdaClient.send(
      new InvokeCommand({
        FunctionName: z.string().parse(process.env.APP_AWS_LAMBDA_FUNCTION),
        Payload: JSON.stringify({
          body: JSON.stringify(body),
        }),
        InvocationType: 'RequestResponse',
      })
    )
    if (invokeOutput.StatusCode !== 200)
      throw new Error(
        `no 200 status code from lambda, got ${invokeOutput.StatusCode}`
      )

    const payload = invokeOutput.Payload
    if (!payload) throw new Error(`no payload returned from lambda`)

    const text = Buffer.from(payload).toString()
    const response = z
      .object({
        statusCode: z.number(),
        body: z.string(),
      })
      .parse(JSON.parse(text))

    if (response.statusCode === 200) {
      const treeViewerData = safeParse(response.body) as TreeViewerData
      return {
        ok: true,
        value: treeViewerData,
      }
    } else {
      const err = safeParse(response.body) as { reason: string }
      return { ok: false, value: err.reason || 'Internal server error' }
    }
  } catch (e: any) {
    console.error(e)
    return { ok: false, value: 'Unexpected error' }
  }
}
