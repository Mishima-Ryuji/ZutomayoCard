import { Batch, decksRef, getDocs } from '~/firebase'

const createCards = async () => {
  const batch = new Batch()
  const decksSnapshot = await getDocs(decksRef)
  const decks = decksSnapshot.docs.map((d) => d.data())
  for (const deck of decks) {
    batch.update(deck.ref, {
      is_recommended: true,
    })
  }
  await batch.commit()
}

createCards()
  .then(() => console.log('finish'))
  .catch(() => console.log('error'))
