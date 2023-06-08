import { DocRef, collection, db, doc } from '~/firebase/alias'
import { getConverter } from '../converter'
import { Document } from '../document'
import { CardSubcols } from './subcollections'

export interface Card extends Document {
  readonly ref: DocRef<Card>
  readonly parent_id: 'cards'
  readonly subcollections: typeof CardSubcols
  image?: { url: string; filename: string; full_path: string }
  category:
    | '1st'
    | '2nd'
    | 'local/techno_poor'
    | 'collab/OIOI'
    | 'bonus/jinkougaku'
  order: number
  no: string
  special_denominator?: string
  rarity?: 'N' | 'N+' | 'R' | 'R+' | 'SR' | 'SR+' | 'UR' | 'SE'
  element?: 'flame' | 'wind' | 'electricity' | 'darkness'
  name?: string
  name_furigana?: string
  effect?: string
  day_offensive_strength?: number
  night_offensive_strength?: number
  clock?: number
  power_cost?: number
  power?: number
  type?: 'character' | 'enchant' | 'area_enchant'
}

export const cardConverter = getConverter<Card>(CardSubcols)
export const cardsRef = collection<Card>(db, 'cards').withConverter(
  cardConverter
)
export const cardRef = (id: string) => doc(cardsRef, id)

type CategoryDetail = {
  id: string
  name: string
  detail?: string
  denominator: string // Card番号の**/**の分母を表す
}

export const getCategoryDetail = (card: Card): CategoryDetail => {
  switch (card.category) {
    case '1st':
      return {
        id: card.category,
        name: '第一弾',
        detail: 'THE WORLD IS CHANGING',
        denominator: '104',
      }
    case '2nd':
      return {
        id: card.category,
        name: '第二弾',
        detail: 'ALL ALONG THE WATCHTOWER',
        denominator: '104',
      }
    case 'local/techno_poor':
      return {
        id: card.category,
        name: 'テクノプアのご当地カード',
        denominator: '20',
      }
    case 'bonus/jinkougaku':
      return {
        id: card.category,
        name: '沈香学の特典',
        denominator: '7',
      }
    case 'collab/OIOI':
      return {
        id: card.category,
        name: 'OIOIコラボ',
        denominator: '♦︎♦︎',
      }
  }
}
