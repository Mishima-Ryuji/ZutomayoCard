import { documentId, orderBy, query, where } from 'firebase/firestore'
import { Card, cardsRef } from '~/firebase'

export const sortedCategoryCardsRef = (category: Card['category']) =>
  query(cardsRef, where('category', '==', category), orderBy('order'))

export const designatedIdsCardsRef = (ids: string[]) =>
  query(cardsRef, where(documentId(), 'in', ids))
