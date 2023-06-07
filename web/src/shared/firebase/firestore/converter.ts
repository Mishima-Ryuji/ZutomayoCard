import {
  DocData,
  FirestoreDataConverter,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  WithFieldValue,
} from '~/firebase/alias'
import { remove } from '~/shared/utils'
import { Document } from './document'

export type ToFirestore<T extends Document> = (
  data: PartialWithFieldValue<T> | WithFieldValue<T>
) => DocData

export type FromFirestore<T extends Document> = (
  snapshot: QueryDocumentSnapshot
) => Partial<T>

export type AdditionalConverter<T extends Document> = {
  toFirestore?: ToFirestore<T>
  fromFirestore?: FromFirestore<T>
}

export const getConverter = <T extends Document>(
  subcols: T['subcollections'],
  { toFirestore, fromFirestore }: AdditionalConverter<T> = {}
) => {
  const converter: FirestoreDataConverter<T> = {
    // toFirestoreはupdate時には呼ばれないので十分注意すること
    toFirestore: (data) => {
      const additional = toFirestore ? toFirestore(data) : {}
      const clean = remove({ ...data, ...additional }, [
        'id',
        'parent_id',
        'ref',
        'subcollections',
      ])
      return clean
    },
    fromFirestore: (snapshot): T => {
      const data = snapshot.data()
      const additional = fromFirestore ? fromFirestore(snapshot) : {}
      return {
        ...data,
        ...additional,
        id: snapshot.id,
        ref: snapshot.ref.withConverter(converter),
        parent_id: snapshot.ref.parent.id,
        subcollections: subcols,
      } as T
    },
  }
  return converter
}
