import { orderBy, query } from "firebase/firestore"
import { useCollectionDataOnce } from "react-firebase-hooks/firestore"
import { uniguriBalloonsRef } from "~/shared/firebase/firestore/scheme/uniguriBalloon"

const uniguriBalloonsOrderedCreated = query(uniguriBalloonsRef, orderBy("updated_at", "desc"))

export const useListUniguriBalloons = () => {
  const [uniguriBalloons, isLoading, error] = useCollectionDataOnce(uniguriBalloonsOrderedCreated)
  return {
    data: uniguriBalloons,
    isLoading,
    error,
  }
}
