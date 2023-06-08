import { ColRef, DocRef, FirestoreDataConverter } from '~/firebase/alias'
import { ValidDocument } from './document'

type Ref<T extends ValidDocument> = ColRef<T> | DocRef<T>

export type ConvertersMap<T> = {
  [key in keyof T as T[key] extends Ref<ValidDocument>
    ? key
    : never]: T[key] extends Ref<infer U> ? FirestoreDataConverter<U> : never
}
