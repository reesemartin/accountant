import { Inject, Injectable } from '@nestjs/common'

import { CollectionReference, Firestore, Timestamp } from 'firebase-admin/firestore'

import { FIRESTORE } from './../firebase/firebase.module'
import { applyListQuery, stripUndefined } from './../utils'
import { Frequency } from './transaction.model'

type TransactionRecord = {
  amount: number
  description: string
  disabled: boolean
  frequency: Frequency | null
  recurring: boolean
  startDate: string
  createdAt: Timestamp
}

export type Transaction = { id: string } & TransactionRecord

@Injectable()
export class TransactionService {
  constructor(@Inject(FIRESTORE) private firestore: Firestore) {}

  private collection(userId: string) {
    return this.firestore
      .collection('users')
      .doc(userId)
      .collection('transactions') as CollectionReference<TransactionRecord>
  }

  async create(params: {
    amount: number
    description: string
    disabled?: boolean
    frequency?: Frequency
    recurring?: boolean
    startDate: string
    userId: string
  }): Promise<Transaction> {
    const data: TransactionRecord = {
      amount: params.amount,
      createdAt: Timestamp.now(),
      description: params.description,
      disabled: params.disabled ?? false,
      frequency: params.frequency ?? null,
      recurring: params.recurring ?? false,
      startDate: params.startDate,
    }
    const ref = await this.collection(params.userId).add(data)
    return { id: ref.id, ...data }
  }

  async delete(params: { id: string; userId: string }): Promise<void> {
    await this.collection(params.userId).doc(params.id).delete()
  }

  async findMany(params: {
    end?: Date
    orderBy?: string
    orderByDirection?: 'asc' | 'desc' | 'ASC' | 'DESC'
    recurring?: boolean
    skip?: number
    start?: Date
    take?: number
    userId: string
  }): Promise<Transaction[]> {
    // Firestore requires the first orderBy to be on the same field as any range filter,
    // so a startDate range forces ordering by startDate regardless of the requested field.
    const orderBy = params.start || params.end ? 'startDate' : params.orderBy
    const query = applyListQuery(this.collection(params.userId), {
      orderBy,
      orderByDirection: params.orderByDirection,
      skip: params.skip,
      take: params.take,
      where: [
        ['recurring', '==', params.recurring],
        ['startDate', '>=', params.start?.toISOString().slice(0, 10)],
        ['startDate', '<=', params.end?.toISOString().slice(0, 10)],
      ],
    })
    const snapshot = await query.get()
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  }

  async get(params: { id: string; userId: string }): Promise<Transaction | undefined> {
    const doc = await this.collection(params.userId).doc(params.id).get()
    return doc.exists ? { id: doc.id, ...(doc.data() as TransactionRecord) } : undefined
  }

  async update(params: { id: string; userId: string; data: Partial<Omit<TransactionRecord, 'createdAt'>> }) {
    const ref = this.collection(params.userId).doc(params.id)
    await ref.update(stripUndefined(params.data))
    const updated = await ref.get()
    return { id: updated.id, ...(updated.data() as TransactionRecord) }
  }

  formatTransaction(transaction: Transaction) {
    return {
      ...transaction,
      createdAt: transaction.createdAt.toDate().toISOString(),
    }
  }
}
