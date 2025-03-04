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
  totalPages: number;
  totalMovies: number;
  setMovies: (movies: Movie[]) => void;
  setPage: (page: number) => void;
  setSortBy: (sortBy: string) => void;
  setTotalPages: (totalPage: number) => void;
  setTotalMovies: (totalMovies: number) => void;
}

const useGenreMovieStore = create<GenreMovieStore>((set) => ({
  movies: [],
  page: 0,
  sortBy: "popularity",
  totalPages: 0,
  totalMovies: 0,
  setMovies: (movies: Movie[]) => set({ movies }),
  setPage: (page: number) => set({ page }),
  setSortBy: (sortBy: string) => set({ sortBy }),
  setTotalPages: (totalPages: number) => set({ totalPages }),
  setTotalMovies: (totalMovies: number) => set({ totalMovies }),
}));

export default useGenreMovieStore;
