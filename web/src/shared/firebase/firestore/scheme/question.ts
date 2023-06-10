import { DocRef, collection, db, doc } from '~/firebase/alias'
import { getConverter } from '../converter'
import { Document } from '../document'
import { QuestionSubcols } from './subcollections'

export interface Question extends Document {
  readonly ref: DocRef<Question>
  readonly parent_id: 'questions'
  readonly subcollections: typeof QuestionSubcols
  card_id?: string
  title: string
  answer: string
}

export const questionConverter = getConverter<Question>(QuestionSubcols)
export const questionsRef = collection<Question>(db, 'questions').withConverter(
  questionConverter
)
export const questionRef = (uid: string) => doc(questionsRef, uid)
