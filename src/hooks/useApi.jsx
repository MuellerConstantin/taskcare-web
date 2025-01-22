import { useEffect, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function useApi() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const refreshToken = useSelector((state) => state.auth.refreshToken);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_TASKCARE_API_URL,
      timeout: 1000,
      headers: {
        Accept: "application/json"
      },
    });

    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        console.error(err);
        return Promise.reject(err);
      }
    );

    return instance;
  }, []);

  useEffect(() => {
    if(api && accessToken) {
      const requestInterceptorId = api.interceptors.request.use((config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      
        return config;
      });
  
      return () => {
        api.interceptors.request.eject(requestInterceptorId);
      }
    }
  }, [accessToken, api]);

  useEffect(() => {
    if(api && refreshToken) {
      const responseInterceptorId = api.interceptors.response.use(
        (res) => res,
        async (err) => {
          const { response, config } = err;
      
          if (response && config.url !== "/auth/refresh") {
            if (response.status === 401 && !config._retry) {
              config._retry = true;
      
              if (refreshToken) {
                try {
                  const refreshRes = await api.post("/auth/refresh", {
                    refreshToken: refreshToken,
                  });
      
                  dispatch({
                    type: ActionTypes.SET_CREDENTIALS,
                    payload: {
                      accessToken: refreshRes.data.accessToken,
                      refreshToken: refreshRes.data.refreshToken,
                    },
                  });
      
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
      
      return () => {
        api.interceptors.response.eject(responseInterceptorId);
      };
    }
  }, [refreshToken, api]);

  return api;
}
