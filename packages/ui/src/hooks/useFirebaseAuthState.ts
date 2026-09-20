import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'

import { AuthService } from '../services'

/**
 * Firebase rehydrates a persisted session asynchronously, so `AuthService.getCurrentUser()` can be
 * momentarily null on page load even for a signed-in user. `initializing` distinguishes "not signed in"
 * from "still checking" so callers don't redirect a signed-in user to /login on refresh.
 */
export function useFirebaseAuthState(): { user: User | null; initializing: boolean } {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser())
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    return AuthService.onAuthStateChanged((nextUser) => {
      setUser(nextUser)
      setInitializing(false)
    })
  }, [])

  return { initializing, user }
}
