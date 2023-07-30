import { query, where } from 'firebase/firestore'
import { profilesRef } from '~/firebase'

export const offeredProfilesRef = (cardId: string) =>
  query(profilesRef, where('offered_card_ids', 'array-contains', cardId))
