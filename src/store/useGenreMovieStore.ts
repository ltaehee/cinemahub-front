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
  setMovies: (movies: Movie[]) => void;
}

const useGenreMovieStore = create<GenreMovieStore>((set) => ({
  movies: [
    {
      title: "",
      movieId: "",
      releaseDate: "",
      posterPath: "",
      genreIds: [],
    },
  ],
  setMovies: (movies: Movie[]) => set({ movies }),
}));

export default useGenreMovieStore;
