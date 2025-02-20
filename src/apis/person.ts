import { AxiosError } from "axios";
import { baseInstance } from "./axios.config";

export const popularActors = async () => {
  try {
    const response = await baseInstance.get("/person/popular");

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      console.log(err.response.data.message);
    }
    throw err;
  }
};
