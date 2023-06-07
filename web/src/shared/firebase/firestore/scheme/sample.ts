import { DocRef, collection, db, doc } from '~/firebase/alias'
import { getConverter } from '../converter'
import { Document } from '../document'
import { SampleSubcols } from './subcollections'

export interface Sample extends Document {
  readonly ref: DocRef<Sample>
  readonly parent_id: 'samples'
  readonly subcollections: typeof SampleSubcols
}

export const sampleConverter = getConverter<Sample>(SampleSubcols)
export const samplesRef = collection<Sample>(db, 'samples').withConverter(
  sampleConverter
)
export const sampleRef = (id: string) => doc(samplesRef, id)
