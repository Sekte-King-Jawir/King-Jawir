import { verifyEmailService } from './verify_email_service'

export const verifyEmailController = {
  async handle(token: string) {
    return verifyEmailService.verify(token)
  }
}
