import { sellerMeService } from './me_service'

export const sellerMeController = {
  async handle(userId: string) {
    return sellerMeService.getMe(userId)
  },
}
