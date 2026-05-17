import { create } from 'zustand'

interface User {
  name: string
  phone: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (name: string, phone: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (name, phone) => set({ 
    user: { name, phone }, 
    isAuthenticated: true 
  }),
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
}))
