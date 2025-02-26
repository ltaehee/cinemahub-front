import { create } from "zustand";

interface State {
  isMovieOpen: boolean;
  isPersonOpen: boolean;
  selectedMovie: number | null;
  selectedPerson: number | null;
}

interface Action {
  setIsMovieOpen: (isOpen: boolean) => void;
  setIsPersonOpen: (isOpen: boolean) => void;
  setSelectedMovie: (id: number | null) => void;
  setSelectedPerson: (id: number | null) => void;
}

export const useModalOpenStore = create<State & Action>((set) => ({
  isMovieOpen: false,
  isPersonOpen: false,
  selectedMovie: null,
  selectedPerson: null,
  setIsMovieOpen: (isOpen: boolean) => set({ isMovieOpen: isOpen }),
  setIsPersonOpen: (isOpen: boolean) => set({ isPersonOpen: isOpen }),
  setSelectedMovie: (id: number | null) => set({ selectedMovie: id }),
  setSelectedPerson: (id: number | null) => set({ selectedPerson: id }),
}));
