import axios, { HttpStatusCode, isAxiosError } from "axios";

axios.defaults.baseURL = "/api";
axios.defaults.headers.common["Content-Type"] = "application/json";

export const baseInstance = axios.create();

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
