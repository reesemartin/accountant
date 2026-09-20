import { Inject, Injectable } from '@nestjs/common'

import { CollectionReference, Firestore, Timestamp } from 'firebase-admin/firestore'

import { FIRESTORE } from './../firebase/firebase.module'
import { applyListQuery } from './../utils'

type BankAccountRecord = {
  balance: number
  name: string
  createdAt: Timestamp
}

export type BankAccount = { id: string } & BankAccountRecord

@Injectable()
export class BankAccountService {
  constructor(@Inject(FIRESTORE) private firestore: Firestore) {}

  private collection(userId: string) {
    return this.firestore
      .collection('users')
      .doc(userId)
      .collection('bankAccounts') as CollectionReference<BankAccountRecord>
  }

  async create(params: { name: string; balance: number; userId: string }): Promise<BankAccount> {
    const data: BankAccountRecord = {
      balance: params.balance,
      createdAt: Timestamp.now(),
      name: params.name,
    }
    const ref = await this.collection(params.userId).add(data)
    return { id: ref.id, ...data }
  }

  async delete(params: { id: string; userId: string }): Promise<void> {
    await this.collection(params.userId).doc(params.id).delete()
  }

  async findMany(params: {
    name?: string
    orderBy?: string
    orderByDirection?: 'asc' | 'desc' | 'ASC' | 'DESC'
    skip?: number
    take?: number
    userId: string
  }): Promise<BankAccount[]> {
    const query = applyListQuery(this.collection(params.userId), {
      orderBy: params.orderBy,
      orderByDirection: params.orderByDirection,
      skip: params.skip,
      take: params.take,
      where: [['name', '==', params.name]],
    })
    const snapshot = await query.get()
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  }

  async get(params: { id: string; userId: string }): Promise<BankAccount | undefined> {
    const doc = await this.collection(params.userId).doc(params.id).get()
    return doc.exists ? { id: doc.id, ...(doc.data() as BankAccountRecord) } : undefined
  }

  async update(params: { id: string; userId: string; data: Partial<Pick<BankAccountRecord, 'balance' | 'name'>> }) {
    const ref = this.collection(params.userId).doc(params.id)
    await ref.update({ ...params.data })
    const updated = await ref.get()
    return { id: updated.id, ...(updated.data() as BankAccountRecord) }
  }

  formatBankAccount(bankAccount: BankAccount) {
    return {
      balance: bankAccount.balance,
      createdAt: bankAccount.createdAt.toDate().toISOString(),
      id: bankAccount.id,
      name: bankAccount.name,
    }
  }
}
