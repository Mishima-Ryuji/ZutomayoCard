import { DocRef, collection, db, doc } from '~/firebase/alias'
import { getConverter } from '../converter'
import { Document } from '../document'
import { AdminSubcols } from './subcollections'

export interface Admin extends Document {
  readonly ref: DocRef<Admin>
  readonly parent_id: 'admin'
  readonly subcollections: typeof AdminSubcols
}

export const adminConverter = getConverter<Admin>(AdminSubcols)
export const adminsRef = collection<Admin>(db, 'admin').withConverter(
  adminConverter
)
export const adminRef = (uid: string) => doc(adminsRef, uid)
