import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'

export const getAuthenticatedUid = (context: https.CallableContext) => {
  const uid = context.auth?.uid
  if (uid !== undefined) return uid
  else
    throw new https.HttpsError('unauthenticated', 'Authentication is required.')
}

export const authenticateUser = (
  context: https.CallableContext,
  uid?: string
) => {
  if (!context.auth) {
    throw new https.HttpsError('unauthenticated', 'Authentication is required.')
  }
  if (uid !== undefined && uid !== context.auth.uid) {
    throw new https.HttpsError(
      'permission-denied',
      'This actions is not permitted to the current user.'
    )
  }
}

export const getCurrentUser = async (context: https.CallableContext) => {
  const uid = getAuthenticatedUid(context)
  const user = await admin.auth().getUser(uid)
  return user
}
