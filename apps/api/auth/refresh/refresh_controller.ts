import { refreshService } from './refresh_service'

export const refreshController = {
  async handle(refreshToken: string, jwtAccess: any, jwtRefresh: any) {
    return refreshService.refresh(refreshToken, jwtAccess, jwtRefresh)
  }
}
