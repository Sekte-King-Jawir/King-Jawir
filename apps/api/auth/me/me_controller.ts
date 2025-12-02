import { meService } from './me_service'

export const meController = {
  async handle(userId: string) {
    return meService.getMe(userId)
  },
}
