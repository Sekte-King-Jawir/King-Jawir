import { sellerRefreshService } from './refresh_service'

export const sellerRefreshController = {
  async handle(refreshToken: string, jwtAccess: any, jwtRefresh: any) {
    return sellerRefreshService.refresh(refreshToken, jwtAccess, jwtRefresh)
  },
}
