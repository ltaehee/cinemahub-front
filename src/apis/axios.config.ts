import axios, { HttpStatusCode, isAxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// axios.defaults.baseURL = "/api";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

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
