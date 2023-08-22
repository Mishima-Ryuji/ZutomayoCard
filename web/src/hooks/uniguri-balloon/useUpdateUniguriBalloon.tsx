import { useState } from "react"
import { UniguriBalloonInput } from "~/components/uniguri_balloon/Form"
import { DocRef, updateDoc } from "~/firebase"
import { UniguriBalloon } from "~/shared/firebase/firestore/scheme/uniguriBalloon"

export interface UseUpdateUniguriBalloonOptions {
  onUpdate: (ref: DocRef<UniguriBalloon>) => void
}
export const useUpdateUniguriBalloon = (options: Partial<UseUpdateUniguriBalloonOptions> = {}) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const onUpdate = async (targetRef: DocRef<UniguriBalloon>, input: UniguriBalloonInput) => {
    setIsUpdating(true)
    try {
      const updatedRef = await updateDoc(targetRef, input)
      options.onUpdate?.(updatedRef)
    } catch (error) {
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }
  return {
    onUpdate,
    isUpdating,
  }
}
