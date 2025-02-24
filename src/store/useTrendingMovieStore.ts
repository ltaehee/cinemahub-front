import { create } from "zustand";

interface Actor {
  id: number;
  name: string;
  character: string;
  profilePath: string;
}

interface Director {
  id: number;
  name: string;
  profilePath: string;
}

interface TrendingDayMovie {
  movieId: number;
  title: string;
  releaseDate: string;
  backdropPath: string;
  genreIds: number[];
  trailer: string | null;
  logoPath: string | null;
  koreanRating: string;
  imgPath: string[];
  runtime: number;
  actor: Actor[];
  director: Director[];
}

interface TrendingWeekMovie {
  movieId: number;
  title: string;
  releaseDate: string;
  posterPath: string;
  genreIds: number[];
}

interface TrendingMoviesState {
  trendingDayMovies: TrendingDayMovie[];
  trendingWeekMovies: TrendingWeekMovie[];
  setTrendingDayMovie: (movies: TrendingDayMovie[]) => void;
  setTrendingWeekMovie: (movies: TrendingWeekMovie[]) => void;
}

export const useTrendingMoviesStore = create<TrendingMoviesState>((set) => ({
  trendingDayMovies: [],
  trendingWeekMovies: [],
  setTrendingDayMovie: (movies) => set({ trendingDayMovies: movies }),
  setTrendingWeekMovie: (movies) => set({ trendingWeekMovies: movies }),
}));
