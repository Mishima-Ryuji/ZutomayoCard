import * as functions from 'firebase-functions'
import { Functions, FunctionsParamsSchema } from '~/firebase'

export const functionsWithRegion = functions.region('asia-northeast1').runWith({
  memory: '256MB',
  secrets: [], // シークレットキーを変えた場合はここを修正
})

export const onCall = <F extends keyof Functions>(
  funcName: F,
  func: (
    data: Functions[F]['output'],
    context: functions.https.CallableContext
  ) => Promise<Functions[F]['returns']>
) => {
  return functionsWithRegion.https.onCall((data: unknown, context) => {
    const parsed = FunctionsParamsSchema[funcName].safeParse(data)
    if (!parsed.success) {
      functions.logger.error(parsed.error)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid argument. More details are in `details` field',
        parsed.error
      )
    }
    return func(parsed.data, context)
  })
}
