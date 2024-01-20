import { Controller, Get } from '@nestjs/common'

import { PrismaService } from 'nestjs-prisma'

@Controller('v1/health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getHealth(): Promise<{ healthy: boolean }> {
    await this.prisma.$queryRaw`SELECT 1;`
    return {
      healthy: true,
    }
  }
}
