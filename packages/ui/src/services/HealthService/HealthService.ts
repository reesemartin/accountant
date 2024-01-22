import { ApiQueryService } from '../ApiQueryService/ApiQueryService'

export class HealthService {
  static async get() {
    return await new ApiQueryService().get<{ healthy: boolean }>({
      endpoint: `api/v1/health`,
    })
  }
}
