import { plainToInstance } from 'class-transformer'

import { randomUUID } from 'crypto'

import { getTestFirestore } from './../../test/firestoreTestApp'
import { BankAccountUpdateDTO } from './bankAccount.model'
import { BankAccountService } from './bankAccount.service'

describe('BankAccountService (Firestore emulator)', () => {
  const bankAccountService = new BankAccountService(getTestFirestore())

  it('applies a partial update (e.g. balance only) without sending undefined fields to Firestore', async () => {
    // Regression test: same Firestore update() + undefined bug as transactions (see the
    // TransactionService test for the full explanation) -- this is the exact call the
    // "Save Balance" feature on the Ledger page makes.
    const userId = randomUUID()
    const bankAccount = await bankAccountService.create({ balance: 100, name: 'Checking', userId })

    const patchBody = plainToInstance(BankAccountUpdateDTO, { balance: 250 })
    expect(Object.keys(patchBody)).toContain('name') // sanity check: undefined keys are really there

    const updated = await bankAccountService.update({
      data: patchBody,
      id: bankAccount.id,
      userId,
    })

    expect(updated.balance).toBe(250)
    expect(updated.name).toBe('Checking')
  })

  it('formats createdAt as an ISO string and balance as a plain number', async () => {
    const userId = randomUUID()
    const bankAccount = await bankAccountService.create({ balance: 100, name: 'Checking', userId })

    const formatted = bankAccountService.formatBankAccount(bankAccount)

    expect(typeof formatted.createdAt).toBe('string')
    expect(new Date(formatted.createdAt).toISOString()).toBe(formatted.createdAt)
    expect(formatted.balance).toBe(100)
  })

  it('scopes findMany to the given userId', async () => {
    const userId = randomUUID()
    const otherUserId = randomUUID()
    const mine = await bankAccountService.create({ balance: 1, name: 'Mine', userId })
    await bankAccountService.create({ balance: 2, name: 'Theirs', userId: otherUserId })

    const results = await bankAccountService.findMany({ userId })

    expect(results.map((account) => account.id)).toEqual([mine.id])
  })

  it('deletes a bank account', async () => {
    const userId = randomUUID()
    const bankAccount = await bankAccountService.create({ balance: 100, name: 'Checking', userId })

    await bankAccountService.delete({ id: bankAccount.id, userId })

    expect(await bankAccountService.get({ id: bankAccount.id, userId })).toBeUndefined()
  })
})
