import { resendVerificationService } from './resend_verification_service'

export const resendVerificationController = {
  async handle(email: string) {
    return resendVerificationService.resend(email)
  }
}
