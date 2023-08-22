import { useState } from "react"
import { UniguriBalloonInput } from "~/components/uniguri_balloon/Form"
import { DocRef, addDoc, fb } from "~/firebase"
import { UniguriBalloon, uniguriBalloonsRef } from "~/shared/firebase/firestore/scheme/uniguriBalloon"
import { isBlank } from "~/shared/utils"

export interface UseAddUniguriBalloonOptions {
  onAdd: (ref: DocRef<UniguriBalloon>) => void
  onError: (error: unknown) => void
}

export const useAddUniguriBalloon = (options: Partial<UseAddUniguriBalloonOptions> = {}) => {
  const [isAddding, setIsAdding] = useState(false)
  const onAdd = async (input: UniguriBalloonInput) => {
    setIsAdding(true)
    try {
      const author = fb.auth.currentUser
      if (isBlank(author)) {
        throw new Error('This action requires authentication.')
      }
      const ref = await addDoc(uniguriBalloonsRef, {
        ...input,
        author_id: author.uid,
        random: Math.random(),
      })
      options.onAdd?.(ref)
    } catch (error) {
      console.error(error)
      options.onError?.(error)
    } finally {
      setIsAdding(false)
    }
  }
  return {
    onAdd,
    isAddding,
  }
}