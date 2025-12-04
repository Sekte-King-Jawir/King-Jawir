import { useAuthContext, type AuthContextType } from '@/components/providers/AuthProvider'

// Re-export the hook to maintain compatibility with existing imports
export function useAuth(): AuthContextType {
  return useAuthContext()
}
