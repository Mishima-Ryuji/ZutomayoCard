import { useState } from "react"
import { DocRef, deleteDoc } from "~/firebase"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"

export interface UseDeleteUniguriBalloonsOptions {
  onDelete: () => void
}
export const useDeleteUniguriBalloons = (options: UseDeleteUniguriBalloonsOptions) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const onDelete = async (targetRef: DocRef<UniguriBalloon>) => {
    setIsDeleting(true)
    try {
      await deleteDoc(targetRef)
      options.onDelete?.()
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }
  return {
    onDelete,
    isDeleting,
  }
}