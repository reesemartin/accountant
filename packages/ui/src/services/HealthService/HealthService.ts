import ApiQueryService from '../ApiQueryService/ApiQueryService'

export class HealthService {
  static async get() {
    const apiQueryRequest = {
      endpoint: `api/v1/health`,
    }

    const apiQueryService = new ApiQueryService()
    return await apiQueryService.get<{ healthy: boolean }>(apiQueryRequest)
  }
}
