import { Controller, Get } from '@nestjs/common'

@Controller('api/v1/health')
export class HealthController {
  constructor() {}

  @Get()
  async getHealth(): Promise<{ healthy: boolean }> {
    return {
      healthy: true,
    }
  }
}
