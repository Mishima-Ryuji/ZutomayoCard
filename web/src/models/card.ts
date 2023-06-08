import { orderBy, query, where } from 'firebase/firestore'
import { Card, cardsRef } from '~/firebase'

export const sortedCategoryCardsRef = (category: Card['category']) =>
  query(cardsRef, where('category', '==', category), orderBy('order'))
