import { logoutService } from './logout_service'

export const logoutController = {
  async handle(refreshToken: string) {
    return logoutService.logout(refreshToken)
  }
}
