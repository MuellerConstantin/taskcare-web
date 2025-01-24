import axios from "axios";
import authSlice from "@/store/slices/auth";

let store;

export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TASKCARE_API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const state = store.getState();

  if (state.auth.accessToken && config.url !== "/auth/refresh") {
    config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err;

    if (response && config.url !== "/auth/refresh") {
      if (response.status === 401 && !config._retry) {
        config._retry = true;
        const state = store.getState();

        if (state.auth.refreshToken) {
          try {
            const refreshRes = await api.post("/auth/refresh", {
              refreshToken: state.auth.refreshToken,
            });

            store.dispatch(
              authSlice.actions.setAuthentication({
                accessToken: refreshRes.data.accessToken,
                refreshToken: refreshRes.data.refreshToken,
                principalName: refreshRes.data.principal
              })
            );

            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${refreshRes.data.accessToken}`,
            };

            return api(config);
          } catch (refeshError) {
            return Promise.reject(refeshError);
          }
        }
      }
    }

    return Promise.reject(err);
  }
);

export default api;
