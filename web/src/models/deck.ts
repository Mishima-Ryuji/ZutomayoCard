import { query, where } from 'firebase/firestore'
import { decksRef } from '~/firebase'

export const publicDecksRef = query(decksRef, where('is_public', '==', true))
