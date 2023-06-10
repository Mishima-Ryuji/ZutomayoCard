import { useAuthState as useFirebaseAuthState } from 'react-firebase-hooks/auth'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { adminRef, fb } from '~/firebase'

export const useAuthState = () => {
  const [user, loading, error] = useFirebaseAuthState(fb.auth)
  const [admin, adminLoading, adminError] = useDocumentDataOnce(
    user ? adminRef(user.uid) : null
  )
  return {
    user,
    loading,
    error,
    admin,
    adminLoading,
    adminError,
    isAdmin: !!admin,
  }
}
