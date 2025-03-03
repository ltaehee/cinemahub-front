import { create } from "zustand";

interface Movie {
  movieId: string;
  posterPath: string;
  title: string;
  releaseDate: string;
  genreIds: [];
}

interface MovieStore {
  movies: Movie[];
  page: number;
  setMovies: (movies: Movie[] | ((prevMovies: Movie[]) => Movie[])) => void;
  setPage: (updater: number | ((prev: number) => number)) => void;
  resetStore: () => void;
}

const useSearchStore = create<MovieStore>((set) => ({
  movies: [],
  page: 1,
  setMovies: (movies) =>
    set((state) => ({
      movies: typeof movies === "function" ? movies(state.movies) : movies,
    })),
  setPage: (updater: number | ((prev: number) => number)) =>
    set((state) => ({
      page: typeof updater === "function" ? updater(state.page) : updater,
    })),
  resetStore: () => set({ movies: [], page: 1 }),
}));

export default useSearchStore;
