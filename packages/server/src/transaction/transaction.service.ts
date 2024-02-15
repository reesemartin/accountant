import { Injectable } from '@nestjs/common'
import { Prisma, Transaction } from '@prisma/client'

import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(data: Omit<Prisma.TransactionCreateInput, 'createdAt' | 'id' | 'user'> & { userId: number }) {
    return this.prisma.transaction.create({
      data,
    })
  }

  async delete(params: { id: number; userId: number }) {
    await this.prisma.transaction.delete({
      where: params,
    })
  }

  async findMany(params: {
    end?: Date
    orderBy?: keyof Transaction
    orderByDirection?: 'asc' | 'desc' | 'ASC' | 'DESC'
    recurring?: boolean
    skip?: number
    start?: Date
    take?: number
    userId: number
  }) {
    return this.prisma.transaction.findMany({
      orderBy: {
        [params.orderBy || 'startDate']: params.orderByDirection?.toLocaleLowerCase() || 'desc',
      },
      skip: params.skip,
      take: params.take,
      where: {
        recurring: params.recurring,
        startDate:
          params.start || params.end
            ? {
                gte: params.start,
                lte: params.end,
              }
            : undefined,
        userId: params.userId,
      },
    })
  }

  async get(params: { id: number }) {
    return this.prisma.transaction.findUnique({
      where: params,
    })
  }

  async update(params: {
    id: number
    userId: number
    data: Omit<Prisma.TransactionUpdateInput, 'createdAt' | 'user'>
  }) {
    return this.prisma.transaction.update({
      data: params.data,
      where: {
        id: params.id,
        userId: params.userId,
      },
    })
  }
}
