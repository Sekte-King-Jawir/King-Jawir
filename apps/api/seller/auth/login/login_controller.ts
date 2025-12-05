import { sellerLoginService } from './login_service'

export const sellerLoginController = {
  async handle(email: string, password: string, jwtAccess: any, jwtRefresh: any) {
    return sellerLoginService.login(email, password, jwtAccess, jwtRefresh)
  },
}
