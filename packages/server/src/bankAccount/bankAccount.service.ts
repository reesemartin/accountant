import { Injectable } from '@nestjs/common'
import { BankAccount, Prisma } from '@prisma/client'

import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class BankAccountService {
  constructor(private prisma: PrismaService) {}

  async create(data: Omit<Prisma.BankAccountCreateInput, 'createdAt' | 'id' | 'user'> & { userId: number }) {
    return this.prisma.bankAccount.create({
      data,
    })
  }

  async delete(params: { id: number; userId: number }) {
    await this.prisma.bankAccount.delete({
      where: params,
    })
  }

  async findMany(params: {
    name?: string
    orderBy?: keyof BankAccount
    orderByDirection?: 'asc' | 'desc' | 'ASC' | 'DESC'
    skip?: number
    take?: number
    userId: number
  }) {
    return this.prisma.bankAccount.findMany({
      orderBy: {
        [params.orderBy || 'startDate']: params.orderByDirection?.toLocaleLowerCase() || 'desc',
      },
      skip: params.skip,
      take: params.take,
      where: {
        name: params.name,
        userId: params.userId,
      },
    })
  }

  async get(params: { id: number; userId: number }) {
    return this.prisma.bankAccount.findUnique({
      where: params,
    })
  }

  async update(params: {
    id: number
    userId: number
    data: Omit<Prisma.BankAccountUpdateInput, 'createdAt' | 'user'>
  }) {
    return this.prisma.bankAccount.update({
      data: params.data,
      where: {
        id: params.id,
        userId: params.userId,
      },
    })
  }

  formatBankAccount(bankAccount: BankAccount) {
    return {
      ...bankAccount,
      balance: Number(bankAccount.balance),
    }
  }
}
