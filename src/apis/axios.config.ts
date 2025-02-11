import axios, { HttpStatusCode, isAxiosError } from "axios";

export const baseInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

baseInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      if (error.status === HttpStatusCode.BadRequest) {
        console.error(error);
        throw new Error(error.response?.data.message);
      }
      if (error.status === HttpStatusCode.Unauthorized) {
        console.error(error);
      }
    }
    return Promise.reject(error);
  }
);
