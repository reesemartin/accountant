import { plainToInstance } from 'class-transformer'

import { randomUUID } from 'crypto'

import { getTestFirestore } from './../../test/firestoreTestApp'
import { Frequency, TransactionUpdateDTO } from './transaction.model'
import { TransactionService } from './transaction.service'

describe('TransactionService (Firestore emulator)', () => {
  const transactionService = new TransactionService(getTestFirestore())

  it('lists transactions filtered by recurring + a startDate range without throwing', async () => {
    // Production Firestore requires the first orderBy to match any range-filtered field;
    // findMany used to default to ordering by createdAt while range-filtering on startDate,
    // which real Firestore rejects -- this is the exact query the Ledger page makes on load.
    // NOTE: this does NOT actually regression-test that fix. The Firestore emulator is more
    // lenient than production here (a documented emulator/production parity gap) and happily
    // runs the pre-fix query shape too, so this only proves the current (fixed) code returns the
    // right, correctly-filtered results -- it can't catch someone reverting the orderBy override.
    // A fresh userId per test keeps each test's data isolated without needing cleanup.
    const userId = randomUUID()
    const oneTime = await transactionService.create({
      amount: 25,
      description: 'Refund',
      recurring: false,
      startDate: '2026-09-10',
      userId,
    })
    await transactionService.create({
      amount: -50,
      description: 'Rent',
      frequency: Frequency.Monthly,
      recurring: true,
      startDate: '2026-09-01',
      userId,
    })

    const results = await transactionService.findMany({
      recurring: false,
      start: new Date('2026-01-01'),
      userId,
    })

    expect(results.map((transaction) => transaction.id)).toEqual([oneTime.id])
  })

  it('orders recurring + date-range results by startDate ascending or descending as requested', async () => {
    const otherUserId = randomUUID()
    const early = await transactionService.create({
      amount: 1,
      description: 'Early',
      recurring: false,
      startDate: '2026-01-01',
      userId: otherUserId,
    })
    const late = await transactionService.create({
      amount: 2,
      description: 'Late',
      recurring: false,
      startDate: '2026-06-01',
      userId: otherUserId,
    })

    const ascending = await transactionService.findMany({
      orderByDirection: 'asc',
      recurring: false,
      start: new Date('2025-01-01'),
      userId: otherUserId,
    })
    expect(ascending.map((transaction) => transaction.id)).toEqual([early.id, late.id])

    const descending = await transactionService.findMany({
      orderByDirection: 'desc',
      recurring: false,
      start: new Date('2025-01-01'),
      userId: otherUserId,
    })
    expect(descending.map((transaction) => transaction.id)).toEqual([late.id, early.id])
  })

  it('applies a partial update without sending undefined fields to Firestore', async () => {
    // Regression test: TypeScript class fields (target es2022) initialize every declared
    // property to `undefined` on instantiation, so plainToInstance(TransactionUpdateDTO, {amount})
    // -- exactly what the controller's ValidationPipe produces for a PATCH body of {amount: 30} --
    // yields an object with explicit `description: undefined`, `disabled: undefined`, etc.
    // Firestore's update() rejects any undefined-valued field outright, so this used to crash
    // every partial edit with a 500. A hand-built `{amount: 30}` literal here wouldn't reproduce
    // it, since it has no other own-properties at all.
    const userId = randomUUID()
    const transaction = await transactionService.create({
      amount: 25,
      description: 'Refund',
      startDate: '2026-09-10',
      userId,
    })

    const patchBody = plainToInstance(TransactionUpdateDTO, { amount: 30 })
    expect(Object.keys(patchBody)).toContain('description') // sanity check: undefined keys are really there

    const updated = await transactionService.update({
      data: patchBody,
      id: transaction.id,
      userId,
    })

    expect(updated.amount).toBe(30)
    expect(updated.description).toBe('Refund')
  })

  it('formats createdAt as an ISO string, not a raw Firestore Timestamp', async () => {
    // Regression test: transaction responses used to skip formatting entirely, leaking a raw
    // Firestore Timestamp ({_seconds, _nanoseconds}) instead of the ISO string the API contract
    // (and the UI's Transaction model) expects.
    const userId = randomUUID()
    const transaction = await transactionService.create({
      amount: 25,
      description: 'Refund',
      startDate: '2026-09-10',
      userId,
    })

    const formatted = transactionService.formatTransaction(transaction)

    expect(typeof formatted.createdAt).toBe('string')
    expect(new Date(formatted.createdAt).toISOString()).toBe(formatted.createdAt)
  })

  it('deletes a transaction', async () => {
    const userId = randomUUID()
    const transaction = await transactionService.create({
      amount: 25,
      description: 'Refund',
      startDate: '2026-09-10',
      userId,
    })

    await transactionService.delete({ id: transaction.id, userId })

    expect(await transactionService.get({ id: transaction.id, userId })).toBeUndefined()
  })
})
