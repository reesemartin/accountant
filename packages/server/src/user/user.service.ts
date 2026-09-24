import { Inject, Injectable } from '@nestjs/common'

import { CollectionReference, Firestore, Timestamp } from 'firebase-admin/firestore'

import { FIRESTORE } from './../firebase/firebase.module'

type UserRecord = {
  createdAt: Timestamp
  email: string
  name: string | null
}

export type User = { id: string } & UserRecord

@Injectable()
export class UserService {
  constructor(@Inject(FIRESTORE) private firestore: Firestore) {}

  private collection() {
    return this.firestore.collection('users') as CollectionReference<UserRecord>
  }

  async findOne(id: string): Promise<User | undefined> {
    const doc = await this.collection().doc(id).get()
    return doc.exists ? { id: doc.id, ...(doc.data() as UserRecord) } : undefined
  }

  async getOrCreate(params: { id: string; email?: string; name?: string | null }): Promise<User> {
    const ref = this.collection().doc(params.id)
    const existing = await ref.get()
    if (existing.exists) {
      return { id: existing.id, ...(existing.data() as UserRecord) }
    }

    const data: UserRecord = {
      createdAt: Timestamp.now(),
      email: params.email || '',
      name: params.name ?? null,
    }
    await ref.set(data)
    return { id: params.id, ...data }
  }

  async update(params: { id: string; name?: string }): Promise<User> {
    const ref = this.collection().doc(params.id)
    await ref.update({ ...(params.name !== undefined ? { name: params.name } : {}) })
    const updated = await ref.get()
    return { id: updated.id, ...(updated.data() as UserRecord) }
  }

  formatUser(user: User) {
    return {
      createdAt: user.createdAt.toDate().toISOString(),
      email: user.email,
      id: user.id,
      name: user.name,
    }
  }
}
