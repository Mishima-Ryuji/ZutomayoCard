import { SubCol } from '../document'
import { Participant } from './championship/participant'

export const CardSubcols = []
export const AdminSubcols = []
export const ComboSubcols = []
export const QuestionSubcols = []
export const DeckSubcols = []
export const ProfileSubcols = []
export const UniguriBalloonSubcols = []
export const ParticipantSubcols = []
export const ChampionshipSubcols: [
  SubCol<Participant>,
] = [
    { id: "participants", children: ParticipantSubcols },
  ]
