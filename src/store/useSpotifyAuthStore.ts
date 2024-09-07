import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

const useSpotifyAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token:any) => set({ token }),
  clearToken: () => set({ token: null }),
}));

export default useSpotifyAuthStore;
