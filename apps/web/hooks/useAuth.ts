import { useAuthContext } from '@/components/providers/AuthProvider'

// Re-export the hook to maintain compatibility with existing imports
export function useAuth() {
  return useAuthContext()
}