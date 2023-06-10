import { DocRef, collection, db, doc } from '~/firebase/alias'
import { getConverter } from '../converter'
import { Document } from '../document'
import { ComboSubcols } from './subcollections'

export interface Combo extends Document {
  readonly ref: DocRef<Combo>
  readonly parent_id: 'combos'
  readonly subcollections: typeof ComboSubcols
  card_ids: string[]
  description: string
}

export const comboConverter = getConverter<Combo>(ComboSubcols)
export const combosRef = collection<Combo>(db, 'combos').withConverter(
  comboConverter
)
export const comboRef = (uid: string) => doc(combosRef, uid)
