import { Global, Module } from '@nestjs/common'

import { App, cert, getApps, initializeApp } from 'firebase-admin/app'
import { Auth, getAuth } from 'firebase-admin/auth'
import { Firestore, getFirestore } from 'firebase-admin/firestore'

import { env } from './../env'

export const FIREBASE_AUTH = Symbol('FIREBASE_AUTH')
export const FIRESTORE = Symbol('FIRESTORE')

function getFirebaseApp(): App {
  return getApps()[0] ?? initializeApp({ credential: cert(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT)) })
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
