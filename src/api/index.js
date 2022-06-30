import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_TASKCARE_REST_URI,
  timeout: 1000,
  headers: {
    Accept: "application/json",
  },
});

export default instance;
