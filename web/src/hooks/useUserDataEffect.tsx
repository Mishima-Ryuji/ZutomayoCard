import { useEffect, useRef } from "react"
import { getDoc, profileRef } from "~/firebase"
import { useAuthState } from "./useAuthState"

export interface UserData {
  uid: string
  name?: string
  contact?: string
}

export const useUserDataEffect = (callback: (userData: UserData) => void) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  const { user, loading } = useAuthState()
  useEffect(() => {
    if (loading || !user) return
    (async () => {
      // useAuthStateのprofileを使うとprofileをloading中なのにprofileLoadingがfalseになってしまうため手動で取得
      const snapshot = await getDoc(profileRef(user.uid))
      const profile = snapshot.data()
      if (profile) {
        // profile
        callbackRef.current({
          uid: user.uid,
          name: profile.name,
          contact: profile.contact,
        })
      } else {
        callbackRef.current({
          uid: user.uid,
          name: user.displayName ?? undefined,
          contact: user.email !== null && user.emailVerified ? user.email : undefined,
        })
      }
    })()
  }, [loading, user])

}