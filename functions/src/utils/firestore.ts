import { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { ConvertersMap, DocRef, ValidDocument } from '~/firebase'

export const toValidDocument = <T extends ValidDocument>(
  snapshot: QueryDocumentSnapshot,
  subcollections: T['subcollections'],
  converters: ConvertersMap<T>
): T => {
  const dataWithCustomFields: Record<string, unknown> = {
    ...snapshot.data(),
    id: snapshot.id,
    ref: snapshot.ref,
    parent_id: snapshot.ref.parent.id,
    subcollections,
  }
  // converterを順番に適用
  for (const rawKey of Object.keys(converters)) {
    const rawRef = dataWithCustomFields[rawKey] as DocRef<unknown>
    const key = rawKey as keyof ConvertersMap<T>
    dataWithCustomFields[rawKey] = rawRef.withConverter(converters[key])
  }
  return dataWithCustomFields as T
}
