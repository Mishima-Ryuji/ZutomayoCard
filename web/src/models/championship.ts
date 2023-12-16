import { DocumentReference, collectionGroup, query, where } from "firebase/firestore"
import { db } from "~/firebase"
import { Championship } from "~/shared/firebase/firestore/scheme/championship"
import { Participant, participantConverter } from "~/shared/firebase/firestore/scheme/championship/participant"

export const joinedChampionshipRefs = (uid: string) =>
  query(
    collectionGroup(db, "participants"),
    where("uid", "==", uid),
  ).withConverter(participantConverter)

export const participantToChampionshipRef = (participant: Participant) =>
  participant.ref.parent.parent as DocumentReference<Championship>
