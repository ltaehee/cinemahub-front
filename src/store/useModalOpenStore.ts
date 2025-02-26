import { create } from "zustand";

interface State {
  isMovieOpen: boolean;
  isPersonOpen: boolean;
  selectedMovie: string | null;
  selectedPerson: string | null;
}

interface Action {
  setIsMovieOpen: (isOpen: boolean) => void;
  setIsPersonOpen: (isOpen: boolean) => void;
  setSelectedMovie: (id: string | null) => void;
  setSelectedPerson: (id: string | null) => void;
}

export const useModalOpenStore = create<State & Action>((set) => ({
  isMovieOpen: false,
  isPersonOpen: false,
  selectedMovie: null,
  selectedPerson: null,
  setIsMovieOpen: (isOpen: boolean) => set({ isMovieOpen: isOpen }),
  setIsPersonOpen: (isOpen: boolean) => set({ isPersonOpen: isOpen }),
  setSelectedMovie: (id: string | null) => set({ selectedMovie: id }),
  setSelectedPerson: (id: string | null) => set({ selectedPerson: id }),
}));
