import { query, where } from "firebase/firestore"
import { useCollectionDataOnce } from "react-firebase-hooks/firestore"
import { uniguriBalloonsRef } from "~/shared/firebase/firestore/scheme/uniguriBalloon"
import { random } from "~/shared/utils"

// とりあえず表示期間設定機能には対応しないためstart_at,end_atの絞り込みは指定しない
const randomUniguriBalloonRef = query(
  uniguriBalloonsRef,
  where("enable", "==", true),
)
export const useRandomUniguriBalloon = () => {
  const [uniguriBalloons, isLoading, error] = useCollectionDataOnce(randomUniguriBalloonRef)
  const uniguriBalloon = uniguriBalloons && random(uniguriBalloons)
  if (error) console.error(error)
  return {
    data: uniguriBalloon,
    isLoading,
    error,
  }
}
