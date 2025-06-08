import { AuthState } from '@/interface/type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore; 