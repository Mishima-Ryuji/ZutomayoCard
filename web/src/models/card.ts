import { documentId, orderBy, query, where } from 'firebase/firestore'
import { Card, cardsRef } from '~/firebase'

export const sortedCategoryCardsRef = (category: Card['category']) =>
  query(cardsRef, where('category', '==', category), orderBy('order'))

export const designatedIdsCardsRef = (ids: string[]) =>
  query(cardsRef, where(documentId(), 'in', ids))

export const cardsSorter = (a: Card, b: Card): number => {
  const categories = [
    '1st',
    '2nd',
    'local/techno_poor',
    'collab/OIOI',
    'bonus/jinkougaku',
  ]
  const aCategoryIndex = categories.findIndex((c) => a.category === c)
  const bCategoryIndex = categories.findIndex((c) => b.category === c)
  if (aCategoryIndex - bCategoryIndex !== 0) {
    return aCategoryIndex - bCategoryIndex
  } else {
    return a.order - b.order
  }
}
