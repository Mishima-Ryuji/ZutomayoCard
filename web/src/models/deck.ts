import { query, where } from 'firebase/firestore'
import { decksRef } from '~/firebase'

export const publicDecksRef = query(decksRef, where('is_public', '==', true))

export const userDecksRef = (uid: string) =>
  query(decksRef, where('created_by', '==', uid))