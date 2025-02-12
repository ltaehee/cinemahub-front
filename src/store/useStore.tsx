import { create } from 'zustand';

type State = {
  IsLogin: boolean;
};

type Action = {
  login: (IsLogin: State['IsLogin']) => void;
  logout: (IsLogin: State['IsLogin']) => void;
};

const useLoginStore = create<State & Action>((set) => ({
  IsLogin: false,
  login: () => set({ IsLogin: true }),
  logout: () => set({ IsLogin: false }),
}));

export default useLoginStore;
