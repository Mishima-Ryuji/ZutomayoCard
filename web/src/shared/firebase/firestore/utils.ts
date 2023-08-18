import { ColRef, DocRef, FirestoreDataConverter, Timestamp } from '~/firebase/alias'
import { ValidDocument } from './document'

type Ref<T extends ValidDocument> = ColRef<T> | DocRef<T>

export type ConvertersMap<T> = {
  [key in keyof T as T[key] extends Ref<ValidDocument>
  ? key
  : never]: T[key] extends Ref<infer U> ? FirestoreDataConverter<U> : never
}

// date

export const minTimestamp = Timestamp.fromMillis(0)
export const maxTimestamp = Timestamp.fromDate(new Date(2200, 11, 31, 0, 0, 0, 0))// 2100年12月31日

export const after = (
  timestamp: Timestamp,
  { year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0, milliSeccond = 0, }: {
    year?: number
    month?: number
    day?: number
    hour?: number
    minute?: number
    second?: number
    milliSeccond?: number
  }) => {
  const date = timestamp.toDate()
  date.setFullYear(date.getFullYear() + year)
  date.setMonth(date.getMonth() + month)
  date.setDate(date.getDate() + day)
  date.setHours(date.getHours() + hour)
  date.setMinutes(date.getMinutes() + minute)
  date.setSeconds(date.getSeconds() + second)
  date.setMilliseconds(date.getMilliseconds() + milliSeccond)
  return Timestamp.fromDate(date)
}

export const set = (
  timestamp: Timestamp,
  { year, month, day, hour, minute, second, milliSeccond, }: {
    year?: number
    month?: number
    day?: number
    hour?: number
    minute?: number
    second?: number
    milliSeccond?: number
  }) => {
  const date = timestamp.toDate()
  if (year !== undefined) date.setFullYear(year)
  if (month !== undefined) date.setMonth(month)
  if (day !== undefined) date.setDate(day)
  if (hour !== undefined) date.setHours(hour)
  if (minute !== undefined) date.setMinutes(minute)
  if (second !== undefined) date.setSeconds(second)
  if (milliSeccond !== undefined) date.setMilliseconds(milliSeccond)
  return Timestamp.fromDate(date)
}
