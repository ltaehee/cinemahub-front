import { create } from "zustand";

interface Movie {
  title: string;
  movieId: string;
  releaseDate: string;
  posterPath: string;
  genreIds: number[];
}

interface GenreMovieStore {
  movies: Movie[];
  page: number;
  sortBy: string;
  setMovies: (movies: Movie[]) => void;
  setPage: (page: number) => void;
  setSortBy: (sortBy: string) => void;
}

const useGenreMovieStore = create<GenreMovieStore>((set) => ({
  movies: [],
  page: 0,
  sortBy: "popularity",
  setMovies: (movies: Movie[]) => set({ movies }),
  setPage: (page: number) => set({ page }),
  setSortBy: (sortBy: string) => set({ sortBy }),
}));

export default useGenreMovieStore;
