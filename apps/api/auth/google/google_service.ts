import { Google, generateState, generateCodeVerifier } from 'arctic'
import { userRepository } from '../shared/user_repository'
import { refreshTokenRepository } from '../shared/refresh_token_repository'

// Initialize Google OAuth
const google = new Google(
  process.env.GOOGLE_CLIENT_ID || '',
  process.env.GOOGLE_CLIENT_SECRET || '',
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback'
)

interface GoogleUserInfo {
  sub: string // Google ID
  email: string
  email_verified: boolean
  name: string
  picture?: string
}

export const googleService = {
  // Generate authorization URL
  createAuthorizationURL() {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    
    const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'email', 'profile'])
    
    return { url: url.toString(), state, codeVerifier }
  },

  // Exchange code for tokens and get user info
  async handleCallback(code: string, codeVerifier: string) {
    try {
      // Exchange code for tokens
      const tokens = await google.validateAuthorizationCode(code, codeVerifier)
      const accessToken = tokens.accessToken()

      // Fetch user info from Google
      const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user info from Google')
      }

      const googleUser = await response.json() as GoogleUserInfo

      return { success: true, googleUser }
    } catch (error) {
      console.error('Google OAuth error:', error)
      return { success: false, error: 'Failed to authenticate with Google' }
    }
  },

  // Find or create user from Google data
  async findOrCreateUser(googleUser: GoogleUserInfo) {
    // 1. Cek apakah user sudah pernah login dengan Google ID ini
    let user = await userRepository.findByGoogleId(googleUser.sub)
    
    if (user) {
      return { user, isNewUser: false }
    }

    // 2. Cek apakah email sudah terdaftar (manual register)
    user = await userRepository.findByEmail(googleUser.email)
    
    if (user) {
      // Link Google account ke user yang sudah ada
      user = await userRepository.linkGoogleAccount(user.id, googleUser.sub, googleUser.picture)
      return { user, isNewUser: false }
    }

    // 3. Buat user baru
    user = await userRepository.createWithGoogle({
      email: googleUser.email,
      name: googleUser.name,
      googleId: googleUser.sub,
      avatar: googleUser.picture
    })

    return { user, isNewUser: true }
  },

  // Create refresh token for OAuth user
  async createRefreshToken(userId: string, token: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    return refreshTokenRepository.create({ userId, token, expiresAt })
  }
}
