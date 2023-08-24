import { DocRef, Timestamp, collection, db, doc } from '~/firebase/alias'
import { getConverter } from '../../converter'
import { Document } from '../../document'
import { ChampionshipSubcols } from '../subcollections'

export type ChampionshipColor = "green" | "purple" | "red" | "blue" | "yellow"

export interface Championship extends Document {
  readonly ref: DocRef<Championship>
  readonly parent_id: 'championships'
  readonly subcollections: typeof ChampionshipSubcols

  // 必須項目(BasicInfo)
  name: string
  hold_at: Timestamp                  // 開催日
  place: string                       // 開催場所
  time_limit_at: Timestamp            // 応募締切
  // 補足項目(OptionalInfo)
  format: string                      // 大会形式
  entry_fee: string                   // 参加費
  need_items: string                  // 持ち物
  detail: string
  // 主催者情報(HostInfo)
  host_name: string                   // 主催者 名
  host_contact: string                // 主催者 の連絡先
  host_uid: string                    // 主催者 のユーザID
  // テーマ情報(ThemeInfo)
  color: ChampionshipColor
}

export const championshipConverter = getConverter<Championship>(ChampionshipSubcols)
export const championshipsRef = collection<Championship>(db, 'championships').withConverter(
  championshipConverter
)
export const championshipRef = (id: string) => doc(championshipsRef, id)
