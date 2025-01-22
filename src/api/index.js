import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TASKCARE_API_URL,
  timeout: 1000,
  headers: {
    Accept: "application/json",
  },
});

export default api;
