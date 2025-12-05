import { sellerLogoutService } from './logout_service'

export const sellerLogoutController = {
  async handle(refreshToken: string) {
    return sellerLogoutService.logout(refreshToken)
  },
}
