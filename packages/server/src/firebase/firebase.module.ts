import { Global, Module } from '@nestjs/common'

import { App, cert, getApps, initializeApp } from 'firebase-admin/app'
import { Auth, getAuth } from 'firebase-admin/auth'
import { Firestore, getFirestore } from 'firebase-admin/firestore'

import { env } from './../env'

export const FIREBASE_AUTH = Symbol('FIREBASE_AUTH')
export const FIRESTORE = Symbol('FIRESTORE')

function getFirebaseApp(): App {
  if (getApps()[0]) {
    return getApps()[0]
  }

  // The Admin SDK auto-detects FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST (set by
  // `yarn dev:emulators`) and routes there instead of production, so local dev needs no real
  // credentials at all.
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    return initializeApp({ projectId: env.FIREBASE_PROJECT_ID || 'demo-accountant' })
  }

  if (!env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT is required outside of local emulator development. Set FIRESTORE_EMULATOR_HOST to use the emulators instead.',
    )
  }

  return initializeApp({ credential: cert(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT)) })
}

@Global()
@Module({
  exports: [FIREBASE_AUTH, FIRESTORE],
  providers: [
    {
      provide: FIREBASE_AUTH,
      useFactory: (): Auth => getAuth(getFirebaseApp()),
    },
    {
      provide: FIRESTORE,
      useFactory: (): Firestore => getFirestore(getFirebaseApp()),
    },
  ],
})
export class FirebaseModule {}
