import { create } from "zustand";

interface ScrollStore {
  isDetail: boolean;
  setIsDetail: (scrollable: boolean) => void;
}

const useScrollStore = create<ScrollStore>((set) => ({
  isDetail: false,
  setIsDetail: (scrollable) => set({ isDetail: scrollable }),
}));

export default useScrollStore;
