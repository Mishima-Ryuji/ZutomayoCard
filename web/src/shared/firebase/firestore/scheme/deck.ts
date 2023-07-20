import { DocRef, collection, db, doc } from '~/firebase/alias'
import { getConverter } from '../converter'
import { Document } from '../document'
import { DeckSubcols } from './subcollections'

export interface Deck extends Document {
  readonly ref: DocRef<Deck>
  readonly parent_id: 'decks'
  readonly subcollections: typeof DeckSubcols
  created_by: string
  card_ids: string[]
  name: string
  youtube_id?: string
  is_public: boolean
  concept?: string
  movement?: string
  cards_adoption?: string
  detail?: string
}

export const deckConverter = getConverter<Deck>(DeckSubcols)
export const decksRef = collection<Deck>(db, 'decks').withConverter(
  deckConverter
)
export const deckRef = (id: string) => doc(decksRef, id)
