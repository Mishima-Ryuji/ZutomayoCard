import { query, where } from 'firebase/firestore'
import { questionsRef } from '~/firebase'

export const designatedCardIdQuestionsRef = (cardId: string) =>
  query(questionsRef, where('card_id', '==', cardId))
