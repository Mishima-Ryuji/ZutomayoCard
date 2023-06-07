export { directCollection, directDoc, getDoc, getDocs } from '~/firebase/alias'
import {
  Batch as AliasBatch,
  CreateParams as AliasCreateParams,
  UpdateParams as AliasUpdateParams,
  ColRef,
  DocRef,
  Timestamp,
  setDoc as aliasSetDoc,
  updateDoc as aliasUpdateDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  isDocRef,
} from '~/firebase/alias'
import { Remove, add as addParams } from '~/shared/utils'
import {
  DocumentBaseKey,
  DocumentBaseKeyExcludeTimestamp,
  SubCol,
  ValidDocument,
} from './document'

export type CreateParams<T> = Remove<AliasCreateParams<T>, DocumentBaseKey>
export type UpdateParams<T> = Remove<AliasUpdateParams<T>, DocumentBaseKey>
export type CreateWithTimestampParams<T> = Remove<
  AliasCreateParams<T>,
  DocumentBaseKeyExcludeTimestamp
>
export type CreateParamsWithoutFieldValue<T> = Remove<T, DocumentBaseKey>
export type UpdateParamsWithoutFieldValue<T> = Partial<
  Remove<T, DocumentBaseKey>
>

export const createDocWithTimestamp = async <T extends ValidDocument>(
  ref: DocRef<T>,
  params: CreateWithTimestampParams<T>
) => {
  await aliasSetDoc(
    ref,
    // 以下では型安全のためにParameterを加えているが
    // 実際はConverterで除去される
    addParams<AliasCreateParams<T>, DocumentBaseKeyExcludeTimestamp>(params, {
      ref,
      subcollections: [], // 間違っている値だがFirestoreに登録されないので問題ない
      id: ref.id,
      parent_id: ref.parent.id,
    })
  )
  return ref
}

export const createDoc = async <T extends ValidDocument>(
  ref: DocRef<T>,
  params: CreateParams<T>
) => {
  const now = Timestamp.now()
  await aliasSetDoc(
    ref,
    // 以下では型安全のためにParameterを加えているが
    // 実際はConverterで除去される
    addParams<AliasCreateParams<T>, DocumentBaseKey>(params, {
      ref,
      id: ref.id,
      parent_id: ref.parent.id,
      subcollections: [], // 間違っている値だがFirestoreに登録されないので問題ない
      created_at: now,
      updated_at: now,
    })
  )
  return ref
}

export const addDocWithTimestamp = async <T extends ValidDocument>(
  ref: ColRef<T>,
  params: CreateWithTimestampParams<T>
) => {
  const docRef = doc(ref)
  await createDocWithTimestamp(docRef, params)
  return docRef
}

export const addDoc = async <T extends ValidDocument>(
  ref: ColRef<T>,
  params: CreateParams<T>
) => {
  const docRef = doc(ref)
  await createDoc(docRef, params)
  return docRef
}

export const updateDoc = async <T extends ValidDocument>(
  ref: DocRef<T>,
  params: UpdateParams<T>,
  updateTimestamp = true
) => {
  const now = Timestamp.now()
  await aliasUpdateDoc(
    ref,
    addParams(params, updateTimestamp ? { updated_at: now } : {})
  )
  return ref
}

export const deleteDoc = async <T extends ValidDocument>(
  ref: DocRef<T>,
  subcollections?: T['subcollections'] | SubCol<ValidDocument>[]
) => {
  const batch = new Batch()
  await batch.delete(ref, subcollections)
  await batch.commit()
}

export const deleteCol = async <T extends ValidDocument>(
  ref: ColRef<T>,
  subcollections?: T['subcollections'] | SubCol<ValidDocument>[]
) => {
  const batch = new Batch()
  await batch.delete(ref, subcollections)
  await batch.commit()
}

export class Batch {
  private static MAX_MUM_OF_WRITES_EACH_BATCH = 500 // Firestoreの1つのバッチの書き込み上限
  private batches: AliasBatch[] = []
  private count = 0

  get batch() {
    // 書き込み上限を超えたらバッチを複数個作る
    // ロールバックは現状未サポート
    if (this.count % Batch.MAX_MUM_OF_WRITES_EACH_BATCH === 0) {
      this.batches.push(new AliasBatch())
    }
    return this.batches[this.batches.length - 1]
  }

  createWithTimestamp<T extends ValidDocument>(
    ref: DocRef<T>,
    params: CreateWithTimestampParams<T>
  ) {
    this.batch.set(
      ref,
      // 以下では型安全のためにParameterを加えているが
      // 実際はConverterで除去される
      addParams<AliasCreateParams<T>, DocumentBaseKeyExcludeTimestamp>(params, {
        ref,
        id: ref.id,
        subcollections: [],
        parent_id: ref.parent.id,
      })
    )
    this.count++
    return ref
  }

  create<T extends ValidDocument>(ref: DocRef<T>, params: CreateParams<T>) {
    const now = Timestamp.now()

    this.batch.set(
      ref,
      // 以下では型安全のためにParameterを加えているが
      // 実際はConverterで除去される
      addParams<AliasCreateParams<T>, DocumentBaseKey>(params, {
        ref,
        id: ref.id,
        parent_id: ref.parent.id,
        subcollections: [],
        created_at: now,
        updated_at: now,
      })
    )
    this.count++
    return ref
  }

  addWithTimestamp<T extends ValidDocument>(
    ref: ColRef<T>,
    params: CreateWithTimestampParams<T>
  ) {
    return this.createWithTimestamp(doc(ref), params)
  }

  add<T extends ValidDocument>(ref: ColRef<T>, params: CreateParams<T>) {
    return this.create(doc(ref), params)
  }

  update<T extends ValidDocument>(
    ref: DocRef<T>,
    params: UpdateParams<T>,
    updateTimestamp = true
  ) {
    const now = Timestamp.now()
    this.batch.update(
      ref,
      addParams(params, updateTimestamp ? { updated_at: now } : {})
    )
    this.count++
    return ref
  }

  // バッチ処理でもasync関数であることに注意
  async delete<T extends ValidDocument>(
    ref: DocRef<T> | ColRef<T>,
    providedSubcollections?: T['subcollections'] | SubCol<ValidDocument> // 代入しない場合は内部で取得する
  ) {
    if (isDocRef(ref)) {
      let subcollections: SubCol<ValidDocument>[] = []
      if (!providedSubcollections) {
        const snapshot = await getDoc(ref)
        const data = snapshot.data()
        subcollections = data?.subcollections ?? []
      }
      this.batch.delete(ref)
      this.count++
      if (subcollections.length === 0) return
      await Promise.all(
        subcollections.map(async (subcollection) => {
          const id = subcollection.id
          const colRef = collection(ref, id)
          await this.delete(colRef, subcollection.children)
        })
      )
    } else {
      const snapshot = await getDocs(ref)
      await Promise.all(
        snapshot.docs.map(async (doc) => {
          await this.delete(doc.ref, providedSubcollections)
        })
      )
    }
  }

  async commit() {
    await Promise.all(this.batches.map(async (batch) => await batch.commit()))
  }
}
