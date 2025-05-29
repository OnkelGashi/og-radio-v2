import { create } from "zustand";

interface UIState {
  nightMode: boolean;
  toggleNightMode: () => void;
  setNightMode: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  nightMode: false, // Day mode by default
  toggleNightMode: () => set((state) => ({ nightMode: !state.nightMode })),
  setNightMode: (value) => set({ nightMode: value }),
}));