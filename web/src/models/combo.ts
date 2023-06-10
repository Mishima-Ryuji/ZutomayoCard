import { query, where } from 'firebase/firestore'
import { combosRef } from '~/firebase'

export const designatedCardIdCombosRef = (cardId: string) =>
  query(combosRef, where('card_ids', 'array-contains', cardId))
