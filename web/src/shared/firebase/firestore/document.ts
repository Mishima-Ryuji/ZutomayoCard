import { DocRef, Timestamp } from '~/firebase/alias'

export type SubCol<T extends ValidDocument> = {
  readonly children: T['subcollections']
  readonly id: T['parent_id']
}

export type ParentRefAssignable<
  T extends ValidDocument,
  U extends ValidDocument
> = SubCol<T> extends U['subcollections'][number] ? DocRef<U> : never

export interface Document {
  readonly id: string
  readonly parent_id: unknown
  readonly ref: DocRef<unknown>
  readonly subcollections: unknown
  created_at: Timestamp
  updated_at: Timestamp
}

export interface ValidDocument extends Document {
  readonly parent_id: string
  readonly subcollections: SubCol<ValidDocument>[]
  readonly ref: DocRef<ValidDocument>
}

export type DocumentBaseKey = keyof Document

export type DocumentBaseKeyExcludeTimestamp = Exclude<
  DocumentBaseKey,
  'created_at' | 'updated_at'
>
