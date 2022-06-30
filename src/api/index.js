import axios from "axios";
import store from "../store";
import authSlice from "../store/slices/auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_TASKCARE_REST_URI,
  timeout: 1000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const state = store.getState();

  if (state.auth.accessToken) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      store.dispatch(authSlice.actions.clearAuthentication());
    }

    return Promise.reject(err);
  }
);

export default api;
