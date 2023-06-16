import sharp = require('sharp')
import { cardsRef, fb, getDocs, updateDoc } from '~/firebase'

const magnification = 5

const resizeCards = async () => {
  const s = fb.storage
  const cards = await getDocs(cardsRef)
  for (const cardDoc of cards.docs) {
    const card = cardDoc.data()
    if (!card.image || card.resized_image) continue
    const filename = card.image.filename
    const fullPath = `cards/${filename}`
    const resizedFullPath = `resized_cards/${filename}`
    const [originalBuffer] = await s
      .bucket('zutomayo-33d04.appspot.com')
      .file(fullPath)
      .download()
    const resizedBuffer = await sharp(originalBuffer)
      .resize({
        width: 63 * magnification,
        height: 88 * magnification,
      })
      .toBuffer()
    await s
      .bucket('zutomayo-33d04.appspot.com')
      .file(resizedFullPath)
      .save(resizedBuffer)
    await updateDoc(card.ref, {
      resized_image: {
        filename,
        full_path: resizedFullPath,
        url: card.image.url.replace('cards', 'resized_cards'),
      },
    })
  }
}

resizeCards().then(() => console.log('finish'))
