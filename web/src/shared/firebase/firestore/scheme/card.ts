import { DocRef, collection, db, doc } from '~/firebase/alias'
import { getConverter } from '../converter'
import { Document } from '../document'
import { CardSubcols } from './subcollections'

export type CardElement = 'flame' | 'wind' | 'electricity' | 'darkness'

export type CardCategory =
  | '1st'
  | '2nd'
  | 'local/techno_poor'
  | 'collab/OIOI'
  | 'bonus/jinkougaku'

export type CardRarity = 'N' | 'N+' | 'R' | 'R+' | 'SR' | 'SR+' | 'UR' | 'SE'

export type CardType = 'character' | 'enchant' | 'area_enchant'

export type CardRank = 'S' | 'A' | 'B' | 'C' | 'D'

export interface Card extends Document {
  readonly ref: DocRef<Card>
  readonly parent_id: 'cards'
  readonly subcollections: typeof CardSubcols
  image?: { url: string; filename: string; full_path: string }
  resized_image?: { url: string; filename: string; full_path: string }
  category: CardCategory
  order: number
  no: string
  special_denominator?: string
  special_procurement_method?: string
  rarity?: CardRarity
  element?: CardElement
  name?: string
  name_furigana?: string
  effect?: string
  day_offensive_strength?: number
  night_offensive_strength?: number
  clock?: number
  power_cost?: number
  power?: number
  type?: 'character' | 'enchant' | 'area_enchant'

  rank?: CardRank
  rank_description?: string

  youtube_id?: string
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
  procurement_method: string
}

export const getDisplayType = (card: Card) => {
  switch (card.type) {
    case 'area_enchant':
      return 'Area Enchant'
    case 'character':
      return 'Character'
    case 'enchant':
      return 'Enchant'
    default:
      return '未設定'
  }
}

export const getCategoryDetail = (card: Card): CategoryDetail => {
  switch (card.category) {
    case '1st':
      return {
        id: card.category,
        name: '第一弾',
        detail: 'THE WORLD IS CHANGING',
        denominator: card.special_denominator ?? '104',
        procurement_method:
          card.special_procurement_method ?? 'ずとまよカード第一弾を開封する。',
      }
    case '2nd':
      return {
        id: card.category,
        name: '第二弾',
        detail: 'ALL ALONG THE WATCHTOWER',
        denominator: card.special_denominator ?? '104',
        procurement_method:
          card.special_procurement_method ?? 'ずとまよカード第二弾を開封する。',
      }
    case 'local/techno_poor':
      return {
        id: card.category,
        name: 'テクノプアのご当地カード',
        denominator: card.special_denominator ?? '20',
        procurement_method:
          card.special_procurement_method ??
          'テクノプアのライブ会場でご当地カードセットステッカーを購入する。現在はトレード以外の入手は不可。',
      }
    case 'bonus/jinkougaku':
      return {
        id: card.category,
        name: '沈香学の特典',
        denominator: card.special_denominator ?? '7',
        procurement_method:
          card.special_procurement_method ??
          '沈香学の特典で付属している。特典には限りがあり、無くなり次第終了。',
      }
    case 'collab/OIOI':
      return {
        id: card.category,
        name: 'OIOIコラボ',
        denominator: card.special_denominator ?? '♦︎♦︎',
        procurement_method: card.special_procurement_method ?? '',
      }
  }
}

export const makeCardTitle = (card: Card | undefined, suffix = '') => {
  if (card === undefined) return undefined
  const categoryDetail = getCategoryDetail(card)
  return card.name !== undefined
    ? `${categoryDetail.name}【${card.no} / ${categoryDetail.denominator}】 ${card.name}${suffix}`
    : undefined
}
