import Storage from "@/hooks/Storage";
import { AuthState } from "@/interface/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: Storage
    }
  )
);

export default useAuthStore;
