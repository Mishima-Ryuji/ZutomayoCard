import { DocRef, Document, Timestamp, collection, db, doc, getConverter } from ".."
import { UniguriBalloonSubcols } from "./subcollections"

export interface UniguriBalloon extends Document {
  readonly ref: DocRef<UniguriBalloon>
  readonly parent_id: 'uniguri_balloons'
  readonly subcollections: typeof UniguriBalloonSubcols

  message: string
  image_url: string
  author_id: string
  enable: boolean
  start_at: Timestamp  // 表示開始時刻
  end_at: Timestamp    // 表示終了時刻
  random: number      // ランダム取得
  button: { type: "link", href: string, text: string } | null
}

export const uniguriBalloonConverter = getConverter<UniguriBalloon>(UniguriBalloonSubcols)
export const uniguriBalloonsRef = collection<UniguriBalloon>(db, 'uniguri_balloons').withConverter(
  uniguriBalloonConverter
)
export const uniguriBalloonRef = (id: string) => doc(uniguriBalloonsRef, id)
