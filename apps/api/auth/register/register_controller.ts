import { registerService } from './register_service'

export const registerController = {
  async handle(email: string, password: string, name: string) {
    return registerService.register(email, password, name)
  }
}
