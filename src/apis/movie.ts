import { AxiosError } from "axios";
import { baseInstance } from "./axios.config";

export const trendingMovies = async () => {
  try {
    const response = await baseInstance.get("/movie/trending");

    if (response.data.isError) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};
