import { create } from "zustand";
import { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthModalOpen: boolean;
  setUser: (user: User | null) => void;
  toggleAuthModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthModalOpen: false,
  setUser: (user) => set({ user }),
  toggleAuthModal: () =>
    set((state) => ({ isAuthModalOpen: !state.isAuthModalOpen })),
}));
