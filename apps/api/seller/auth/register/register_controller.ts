import { sellerRegisterService } from './register_service'

export const sellerRegisterController = {
  async handle(
    email: string,
    password: string,
    name: string,
    storeName: string,
    storeDescription?: string
  ) {
    return sellerRegisterService.register(email, password, name, storeName, storeDescription)
  },
}
