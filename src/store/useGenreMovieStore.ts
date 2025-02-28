import { create } from "zustand";

interface Movie {
  title: string;
  movieId: string;
  releaseDate: string;
  posterPath: string;
  genreIds: number[];
}

type SortBy = "popularity" | "latest" | "title";

interface GenreMovieStore {
  movies: Movie[];
  page: number;
  sortBy: SortBy;
  setMovies: (movies: Movie[]) => void;
  setPage: (page: number) => void;
  setSortBy: (sortBy: SortBy) => void;
}

const useGenreMovieStore = create<GenreMovieStore>((set) => ({
  movies: [],
  page: 0,
  sortBy: "popularity",
  setMovies: (movies: Movie[]) => set({ movies }),
  setPage: (page: number) => set({ page }),
  setSortBy: (sortBy: SortBy) => set({ sortBy }),
}));

export default useGenreMovieStore;
