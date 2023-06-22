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
} from 'firebase-admin/firestore'
import { ValidDocument } from '~/shared/firebase/firestore/document'
import { fb } from './instance'
export { FieldValue, Timestamp } from 'firebase-admin/firestore'
export type {
  FirestoreDataConverter,
  PartialWithFieldValue,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  WithFieldValue,
  WriteBatch,
} from 'firebase-admin/firestore'

export type DB = Firestore
export type DocData = DocumentData
export type DocRef<T> = DocumentReference<T>
export type ColRef<T> = CollectionReference<T>
export type DocSnapshot<T> = DocumentSnapshot<T>
export type CreateParams<T> = WithFieldValue<T>
export type UpdateParams<T> = UpdateData<T>
export const db = fb.db

export const directCollection = <T extends ValidDocument>(
  db: DB,
  path: string
): ColRef<T> => {
  return db.collection(path) as ColRef<T>
}

export const collection = <T extends ValidDocument>(
  base: DB | DocRef<DocData>,
  id: T['parent_id']
) => base.collection(id) as ColRef<T>

export const directDoc = <T extends ValidDocument>(
  db: DB,
  path: string
): DocRef<T> => {
  return db.doc(path) as DocRef<T>
}

export const doc = <T extends ValidDocument>(
  colRef: ColRef<T>,
  id?: T['id']
): DocRef<T> => (id !== undefined ? colRef.doc(id) : colRef.doc())

export const isDocRef = <T extends ValidDocument>(
  ref: DocRef<T> | ColRef<T>
): ref is DocRef<T> => {
  return ref.path.split('/').length % 2 === 0
}

export const isColRef = <T extends ValidDocument>(
  ref: DocRef<T> | ColRef<T>
): ref is DocRef<T> => {
  return ref.path.split('/').length % 2 === 1
}

export const getDoc = <T extends ValidDocument>(
  ref: DocRef<T>
): Promise<DocSnapshot<T>> => ref.get()

export const getDocs = <T extends ValidDocument>(
  ref: ColRef<T> | Query<T>
): Promise<QuerySnapshot<T>> => ref.get()

export const setDoc = async <T extends ValidDocument>(
  ref: DocRef<T>,
  params: CreateParams<T>
) => {
  await ref.set(params)
}

export const updateDoc = async <T extends ValidDocument>(
  ref: DocRef<T>,
  params: UpdateParams<T>
) => {
  await ref.update(params)
}
export const deleteDoc = async (ref: DocRef<unknown>) => {
  await ref.delete()
}

export class Batch {
  batch: WriteBatch

  constructor() {
    this.batch = db.batch()
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
