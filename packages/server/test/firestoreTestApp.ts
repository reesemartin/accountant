import { App, getApps, initializeApp } from 'firebase-admin/app'
import { Firestore, getFirestore } from 'firebase-admin/firestore'

/**
 * These integration tests are meant to run only against the Firestore emulator (via
 * `yarn test:integration`, which wraps the run in `firebase emulators:exec`). Bail out clearly
 * rather than silently hitting a real Firestore project if someone runs this file directly.
 */
export function getTestFirestore(): Firestore {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error(
      'FIRESTORE_EMULATOR_HOST is not set. Run these tests via `yarn test:integration`, which starts the Firestore emulator for you.',
    )
  }

  const app: App = getApps()[0] ?? initializeApp({ projectId: 'demo-accountant-test' })
  return getFirestore(app)
}
