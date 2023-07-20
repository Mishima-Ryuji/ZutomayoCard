import { DocRef, collection, db, doc } from '~/firebase/alias'
import { getConverter } from '../converter'
import { Document } from '../document'
import { ProfileSubcols } from './subcollections'

export interface Profile extends Document {
  readonly ref: DocRef<Profile>
  readonly parent_id: 'profiles'
  readonly subcollections: typeof ProfileSubcols
  name: string
  contact: string
  requirement: string
  offered_card_ids: string[]
  received_card_ids: string[]
}

export const profileConverter = getConverter<Profile>(ProfileSubcols)
export const profilesRef = collection<Profile>(db, 'profiles').withConverter(
  profileConverter
)
export const profileRef = (id: string) => doc(profilesRef, id)
