import { changePasswordService } from './change_password_service'

export const changePasswordController = {
  async handle(userId: string, currentPassword: string, newPassword: string) {
    return changePasswordService.changePassword(userId, currentPassword, newPassword)
  },
}
