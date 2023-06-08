import { Batch, Card, cardsRef } from '~/firebase'

const MAX_NUM = 2
const MIN_NUM = 1
const CATEGORY: Card['category'] = 'collab/OIOI'

const createCards = async () => {
  const batch = new Batch()
  for (let i = MIN_NUM; i <= MAX_NUM; i++) {
    batch.add(cardsRef, {
      category: CATEGORY,
      order: i,
      no: `${i}`,
    })
  }
  await batch.commit()
}

createCards()
  .then(() => console.log('finish'))
  .catch(() => console.log('error'))
