import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  Query,
  QuerySnapshot,
  UpdateData,
  WithFieldValue,
  WriteBatch,
  collection as originalCollection,
  deleteDoc as originalDeleteDoc,
  doc as originalDoc,
  getDoc as originalGetDoc,
  getDocs as originalGetDocs,
  setDoc as originalSetDoc,
  updateDoc as originalUpdateDoc,
  writeBatch,
} from 'firebase/firestore'
import { ValidDocument } from '~/shared/firebase/firestore/document'
import { fb } from './instance'
export { FieldValue, Timestamp } from 'firebase/firestore'
export type {
  FirestoreDataConverter,
  PartialWithFieldValue,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  WithFieldValue,
  WriteBatch,
} from 'firebase/firestore'

export const db = fb.db

export type DocData = DocumentData
export type DocRef<T> = DocumentReference<T>
export type ColRef<T> = CollectionReference<T>
export type DocSnapshot<T> = DocumentSnapshot<T>
export type DB = Firestore
export type CreateParams<T> = WithFieldValue<T>
export type UpdateParams<T> = UpdateData<T>

export const directCollection = <T extends ValidDocument>(
  db: DB,
  path: string
): ColRef<T> => {
  return originalCollection(db, path) as ColRef<T>
}

export const collection = <T extends ValidDocument>(
  base: DB | DocRef<DocData>,
  id: T['parent_id']
): ColRef<T> => {
  // 同じ処理だがわけないとType Errorになる
  if (base instanceof Firestore) {
    return originalCollection(base, id) as ColRef<T>
  } else {
    return originalCollection(base, id) as ColRef<T>
  }
}

export const directDoc = <T extends ValidDocument>(
  db: DB,
  path: string
): DocRef<T> => {
  return originalDoc(db, path) as DocRef<T>
}

export const doc = <T extends ValidDocument>(
  colRef: ColRef<T>,
  id?: T['id']
): DocRef<T> => (id ? originalDoc(colRef, id) : originalDoc(colRef))

export const isDocRef = <T extends ValidDocument>(
  ref: DocRef<T> | ColRef<T>
): ref is DocRef<T> => {
  return ref.type === 'document'
}

export const isColRef = <T extends ValidDocument>(
  ref: DocRef<T> | ColRef<T>
): ref is DocRef<T> => {
  return ref.type === 'collection'
}

export const getDoc = <T extends ValidDocument>(
  ref: DocRef<T>
): Promise<DocSnapshot<T>> => originalGetDoc(ref)

export const getDocs = <T extends ValidDocument>(
  ref: ColRef<T> | Query<T>
): Promise<QuerySnapshot<T>> => originalGetDocs(ref)

export const setDoc = async <T extends ValidDocument>(
  ref: DocRef<T>,
  params: CreateParams<T>
) => {
  await originalSetDoc(ref, params)
}

export const updateDoc = async <T extends ValidDocument>(
  ref: DocRef<T>,
  params: UpdateParams<T>
) => {
  await originalUpdateDoc(ref, params)
}
export const deleteDoc = async (ref: DocRef<unknown>) => {
  await originalDeleteDoc(ref)
}

export class Batch {
  batch: WriteBatch

  constructor() {
    this.batch = writeBatch(fb.db)
  }

  set<T extends ValidDocument>(ref: DocRef<T>, params: CreateParams<T>) {
    this.batch.set(ref, params)
  }

  update<T extends ValidDocument>(ref: DocRef<T>, params: UpdateParams<T>) {
    this.batch.update(ref, params)
  }

  delete(ref: DocRef<unknown>) {
    this.batch.delete(ref)
  }

  async commit() {
    await this.batch.commit()
  }
}
