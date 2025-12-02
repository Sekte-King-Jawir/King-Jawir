import { googleService } from './google_service'

export const googleController = {
  // Start OAuth flow
  startAuth() {
    return googleService.createAuthorizationURL()
  },

  // Handle callback from Google
  async handleCallback(code: string, codeVerifier: string) {
    // Get Google user info
    const result = await googleService.handleCallback(code, codeVerifier)

    if (!result.success || !result.googleUser) {
      return { success: false, message: result.error || 'Google authentication failed' }
    }

    // Find or create user
    const { user, isNewUser } = await googleService.findOrCreateUser(result.googleUser)

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        role: user.role,
      },
      isNewUser,
    }
  },

  // Create refresh token
  async createRefreshToken(userId: string, token: string) {
    return googleService.createRefreshToken(userId, token)
  },
}
