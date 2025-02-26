import { AxiosError } from "axios";
import { baseInstance } from "./axios.config";

export const trendingMovies = async () => {
  try {
    const response = await baseInstance.get("/movie/trending");

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

export const movieDetail = async (movieId: string) => {
  try {
    const response = await baseInstance.get(`/movie/${movieId}`);

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

export const movieImages = async (
  movieId: string,
  page: number,
  limit: number
) => {
  try {
    const response = await baseInstance.get(`/movie/${movieId}/images`, {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};

export const moviePosters = async (
  movieId: string,
  page: number,
  limit: number
) => {
  try {
    const response = await baseInstance.get(`/movie/${movieId}/posters`, {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};
