import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(params: Partial<User>) {
    return await this.prisma.user.findUnique({
      where: {
        email: params.email,
        id: params.id,
      },
    })
  }

  async create(params: Omit<User, 'id' | 'createdAt' | 'refreshToken'>) {
    return await this.prisma.user.create({
      data: params,
    })
  }

  async update(params: { id: number } & Partial<Omit<User, 'id' | 'createdAt'>>) {
    return await this.prisma.user.update({
      data: {
        ...params,
        id: undefined,
      },
      where: {
        id: params.id,
      },
    })
  }

  formatUser(user: User) {
    return {
      createdAt: user.createdAt,
      email: user.email,
      id: user.id,
      name: user.name,
    }
  }
}
