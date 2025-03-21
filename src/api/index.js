import axios from "axios";
import authSlice from "@/store/slices/auth";

let store;

export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
  baseURL: "/api/proxy",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

let isRefreshingAuth = false;
let authRefreshSubscribers = [];

const subscribeAuthRefresh = (callback) => {
  authRefreshSubscribers.push(callback);
};

const onAuthRefreshed = (accessToken) => {
  authRefreshSubscribers.forEach((callback) => callback(null, accessToken));
  authRefreshSubscribers = [];
};

const onAuthRefreshFailed = (error) => {
  authRefreshSubscribers.forEach((callback) => callback(error, null));
  authRefreshSubscribers = [];
};

api.interceptors.request.use((config) => {
  if (!store) return config;

  const state = store.getState();

  if (state.auth.accessToken && config.url !== "/auth/refresh") {
    config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (!store) return Promise.reject(err);

    const { response, config } = err;

    if (response && config.url !== "/auth/refresh") {
      if (
        response.status === 401 &&
        response.data?.error === "AuthenticationError" &&
        !config._retry
      ) {
        config._retry = true;
        const state = store.getState();

        if (state.auth.refreshToken) {
          if (!isRefreshingAuth) {
            isRefreshingAuth = true;

            try {
              const refreshRes = await api.post("/auth/refresh", {
                refreshToken: state.auth.refreshToken,
              });

              store.dispatch(
                authSlice.actions.setAuthentication({
                  accessToken: refreshRes.data.accessToken,
                  refreshToken: refreshRes.data.refreshToken,
                  principalName: refreshRes.data.principal,
                }),
              );

              onAuthRefreshed(refreshRes.data.accessToken);
              return api(config);
            } catch (refeshError) {
              onAuthRefreshFailed(refeshError);
              return Promise.reject(refeshError);
            } finally {
              isRefreshingAuth = false;
            }
          }

          return new Promise((resolve, reject) => {
            subscribeAuthRefresh((refreshError, accessToken) => {
              if (refreshError) {
                reject(refreshError);
              } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
                resolve(api(config));
              }
            });
          });
        }
      }
    }

    return Promise.reject(err);
  },
);

export default api;
