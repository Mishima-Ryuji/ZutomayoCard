import { query, where } from 'firebase/firestore'
import { decksRef } from '~/firebase'

export const recommendedDecksRef = query(
  decksRef,
  where('is_recommended', '==', true),
  where('is_public', '==', true)
)

export const userDecksRef = (uid: string) =>
  query(decksRef, where('created_by', '==', uid))

export const publicUserDecksRef = (uid: string) =>
  query(
    decksRef,
    where('created_by', '==', uid),
    where('is_public', '==', true)
  )
