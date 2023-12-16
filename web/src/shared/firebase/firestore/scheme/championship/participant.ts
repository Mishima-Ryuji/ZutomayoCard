import { DocRef, collection, doc, getConverter } from '~/firebase'
import { championshipRef } from '.'
import { Document } from '../../document'
import { ParticipantSubcols } from '../subcollections'

export interface Participant extends Document {
  readonly ref: DocRef<Participant>
  readonly parent_id: 'participants'
  readonly subcollections: typeof ParticipantSubcols

  name: string
  detail: string
  contact: string
  uid: string // 認証必須
}

export const participantConverter = getConverter<Participant>(ParticipantSubcols)
export const participantsRef = (championshipId: string) =>
  collection<Participant>(championshipRef(championshipId), 'participants')
    .withConverter(participantConverter)
export const participantRef = (championshipId: string, participantId: string) =>
  doc(
    participantsRef(championshipId),
    participantId,
  )
