// Action Result untuk UI
export interface ActionResult {
  success: boolean
  message: string
  redirectTo?: string
}

// API Response type - strict typing
export interface ApiResponse {
  success: boolean
  message: string
}

export interface LoginData {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
  }
}

// Login API response
export interface LoginApiResponse {
  success: boolean
  message: string
  data?: LoginData
}

export interface RegisterData {
  user: {
    id: string
    email: string
    name: string
  }
}

export const initialState: ActionResult = {
  success: false,
  message: '',
}
