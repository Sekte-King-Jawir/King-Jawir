import { loginService } from './login_service'

export const loginController = {
  async handle(email: string, password: string, jwtAccess: any, jwtRefresh: any) {
    return loginService.login(email, password, jwtAccess, jwtRefresh)
  }
}
