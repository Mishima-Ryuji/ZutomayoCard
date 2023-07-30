import { useAuthState as useFirebaseAuthState } from 'react-firebase-hooks/auth'
import {
  useDocumentData,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore'
import { adminRef, fb, profileRef } from '~/firebase'

export const useAuthState = () => {
  const [user, loading, error] = useFirebaseAuthState(fb.auth)
  const [admin, adminLoading, adminError] = useDocumentDataOnce(
    user ? adminRef(user.uid) : null
  )
  const [profile, profileLoading] = useDocumentData(
    user ? profileRef(user.uid) : null
  )
  return {
    user: loading ? undefined : user,
    loading,
    error,
    admin,
    adminLoading: loading || adminLoading,
    adminError,
    profile,
    isAdmin: !!admin,
    profileLoading: loading || profileLoading,
  }
}
