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
