import { FirebaseApp, initializeApp } from 'firebase/app'
import { Auth, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth'

const firebaseApp: FirebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
})

const firebaseAuth: Auth = getAuth(firebaseApp)
const googleProvider = new GoogleAuthProvider()

export class AuthService {
  static async signInWithGoogle(): Promise<User> {
    const result = await signInWithPopup(firebaseAuth, googleProvider)
    return result.user
  }

  static async signOut(): Promise<void> {
    await signOut(firebaseAuth)
  }

  static getCurrentUser(): User | null {
    return firebaseAuth.currentUser
  }

  /** Firebase caches the token and only refreshes it over the network once it's close to expiring. */
  static async getIdToken(): Promise<string | null> {
    return firebaseAuth.currentUser ? firebaseAuth.currentUser.getIdToken() : null
  }

  /** Fires once Firebase has finished rehydrating any persisted session, then on every subsequent change. */
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(firebaseAuth, callback)
  }
}
