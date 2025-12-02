import { forgotPasswordService } from './forgot_password_service'

export const forgotPasswordController = {
  async requestReset(email: string) {
    return forgotPasswordService.requestReset(email)
  },

  async resetPassword(token: string, newPassword: string) {
    return forgotPasswordService.resetPassword(token, newPassword)
  },
}
