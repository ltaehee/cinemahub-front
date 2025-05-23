import { create } from "zustand";

type State = {
  IsLogin: boolean;
};

type Action = {
  login: () => void;
  logout: () => void;
};

const useLoginStore = create<State & Action>((set) => ({
  IsLogin: false,
  login: () => set({ IsLogin: true }),
  logout: () => set({ IsLogin: false }),
}));

export default useLoginStore;
