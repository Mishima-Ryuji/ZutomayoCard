import {
  ColRef,
  ConvertersMap,
  DocRef,
  FirestoreDataConverter,
  Timestamp,
  ValidDocument,
  collection,
  db,
  directDoc,
} from '@pkg/shared/firebase'
import { z } from 'zod'

export type Serialized<T> = {
  [key in keyof T]: T[key] extends Timestamp
    ? SerializedTimestamp
    : T[key] extends DocRef<infer U>
    ? SerializedDocRef<U>
    : T[key] extends ColRef<infer U>
    ? ColRef<U>
    : T[key]
}

const TimestampValidator = z.object({
  nanoseconds: z.number(),
  seconds: z.number(),
})

const SerializedTimestampValidator = z.object({
  type: z.literal('SerializedTimestamp'),
  nanoseconds: z.number(),
  seconds: z.number(),
})

const DocRefValidator = z.object({
  type: z.literal('document'),
  id: z.string(),
  path: z.string(),
  parent: z.object({
    id: z.string(),
  }),
})

const SerializedDocRefValidator = z.object({
  type: z.literal('DocRef'),
  path: z.string(),
  parent_id: z.string(),
  id: z.string(),
})

const ColRefValidator = z.object({
  type: z.literal('collection'),
  id: z.string(),
  path: z.string(),
  parent: z
    .object({
      id: z.string(),
    })
    .nullable(),
})

const SerializedColRefValidator = z.object({
  type: z.literal('ColRef'),
  path: z.string(),
  parent_id: z.string().nullable(),
  id: z.string(),
})

export type SerializedTimestamp = z.infer<typeof SerializedTimestampValidator>

export type SerializedDocRef<T> = T extends ValidDocument
  ? {
      type: 'DocRef'
      path: string
      parent_id: T['parent_id']
      id: T['id']
    }
  : never

export type SerializedColRef<T> = T extends ValidDocument
  ? {
      type: 'ColRef'
      path: string
      parent_id: string | null
      id: string
    }
  : never

const isTimestamp = (o: unknown): o is Timestamp => {
  return TimestampValidator.safeParse(o).success
}

const isDocRef = (o: unknown): o is DocRef<ValidDocument> => {
  return DocRefValidator.safeParse(o).success
}

const isColRef = (o: unknown): o is ColRef<ValidDocument> => {
  return ColRefValidator.safeParse(o).success
}

const isSerializedTimestamp = (o: unknown): o is SerializedTimestamp => {
  return SerializedTimestampValidator.safeParse(o).success
}

const isSerializedDocRef = (
  o: unknown
): o is SerializedDocRef<ValidDocument> => {
  return SerializedDocRefValidator.safeParse(o).success
}

const isSerializedColRef = (
  o: unknown
): o is SerializedColRef<ValidDocument> => {
  return SerializedColRefValidator.safeParse(o).success
}

const serializeTimestamp = (o: Timestamp): SerializedTimestamp => {
  return {
    type: 'SerializedTimestamp',
    nanoseconds: o.nanoseconds,
    seconds: o.seconds,
  }
}

const serializeDocRef = (
  o: DocRef<ValidDocument>
): SerializedDocRef<ValidDocument> => {
  return {
    type: 'DocRef',
    path: o.path,
    parent_id: o.parent.id,
    id: o.id,
  }
}

const serializeColRef = (
  o: ColRef<ValidDocument>
): SerializedColRef<ValidDocument> => {
  return {
    type: 'ColRef',
    path: o.path,
    parent_id: o.parent ? o.parent.id : null,
    id: o.id,
  }
}

export const serialize = <T>(document: T): Serialized<T> => {
  const serialized: Record<string, unknown> = {}
  for (const key in document) {
    const value = document[key]
    if (isTimestamp(value)) serialized[key] = serializeTimestamp(value)
    else if (isDocRef(value)) serialized[key] = serializeDocRef(value)
    else if (isColRef(value)) serialized[key] = serializeColRef(value)
    else serialized[key] = value
  }
  return serialized as Serialized<T>
}

export const serializeArray = <T>(documents: T[]): Serialized<T>[] => {
  return documents.map((document) => serialize(document))
}

const deserializeTimestamp = (o: SerializedTimestamp): Timestamp => {
  return new Timestamp(o.seconds, o.nanoseconds)
}

const deserializeDocRef = (
  o: SerializedDocRef<ValidDocument>,
  converter: FirestoreDataConverter<ValidDocument>
): DocRef<ValidDocument> => {
  return directDoc(db, o.path).withConverter(converter)
}

const deserializeColRef = (
  o: SerializedColRef<ValidDocument>,
  converter: FirestoreDataConverter<ValidDocument>
): ColRef<ValidDocument> => {
  return collection(db, o.path).withConverter(converter)
}

export const deserialize = <T>(
  serializedDocument: Serialized<T>,
  converters: ConvertersMap<T>
): T => {
  const deserialized: Record<string, unknown> = {}
  for (const key in serializedDocument) {
    const value = serializedDocument[key]
    if (isSerializedTimestamp(value))
      deserialized[key] = deserializeTimestamp(value)
    else if (isSerializedDocRef(value))
      deserialized[key] = deserializeDocRef(
        value,
        converters[key as unknown as keyof ConvertersMap<T>]
      )
    else if (isSerializedColRef(value))
      deserialized[key] = deserializeColRef(
        value,
        converters[key as unknown as keyof ConvertersMap<T>]
      )
    else deserialized[key] = value
  }
  return deserialized as T
}

export const deserializeArray = <T>(
  serializedDocuments: Serialized<T>[],
  converters: ConvertersMap<T>
): T[] => {
  return serializedDocuments.map((serializedDocument) =>
    deserialize(serializedDocument, converters)
  )
}
