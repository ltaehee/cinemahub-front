import { create } from "zustand";

interface Movie {
  movieId: string;
  posterPath: string;
  title: string;
  releaseDate: string;
  genreIds: [];
}
interface People {
  id: string;
  name: string;
  profile_path: string;
}

interface PeopleWithMovie {
  poster_path: string;
  id: string;
  name: string;
  popularity: number;
  title: string;
  release_date: string;
  genre_ids: [];
}

interface MovieAndPeopleStore {
  movies: Movie[];
  page: number;
  keywordState: string;
  categoryState: string;
  setMovies: (movies: Movie[] | ((prevMovies: Movie[]) => Movie[])) => void;
  setPage: (updater: number | ((prev: number) => number)) => void;
  setKeywordState: (keyword: string) => void;
  setCategoryState: (category: string) => void;
  people: People[];
  peopleWithMovie: PeopleWithMovie[];
  setPeople: (people: People[] | ((prevPeople: People[]) => People[])) => void;
  setPeopleWithMovie: (
    peopleWithMovie:
      | PeopleWithMovie[]
      | ((prevMovies: PeopleWithMovie[]) => PeopleWithMovie[])
  ) => void;
}

const useSearchStore = create<MovieAndPeopleStore>((set) => ({
  movies: [],
  page: 1,
  keywordState: "",
  categoryState: "",
  setMovies: (movies) =>
    set((state) => ({
      movies: typeof movies === "function" ? movies(state.movies) : movies,
    })),
  setPage: (updater: number | ((prev: number) => number)) =>
    set((state) => ({
      page: typeof updater === "function" ? updater(state.page) : updater,
    })),
  setKeywordState: (keyword) => set(() => ({ keywordState: keyword })),
  setCategoryState: (category) => set(() => ({ categoryState: category })),

  people: [],
  peopleWithMovie: [],
  setPeople: (people) =>
    set((state) => ({
      people: typeof people === "function" ? people(state.people) : people,
    })),
  setPeopleWithMovie: (peopleWithMovie) =>
    set((state) => ({
      peopleWithMovie:
        typeof peopleWithMovie === "function"
          ? peopleWithMovie(state.peopleWithMovie)
          : peopleWithMovie,
    })),
}));

export default useSearchStore;
