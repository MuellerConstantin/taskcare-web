"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Spinner, TextInput } from "flowbite-react";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useSWRConfig } from "swr";
import authSlice from "@/store/slices/auth";
import useApi from "@/hooks/useApi";

const customTextInputTheme = {
  field: {
    input: {
      colors: {
        gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500",
      },
    },
  },
};

const schema = yup.object().shape({
  username: yup.string().required("Is required"),
  password: yup.string().required("Is required"),
});

export default function Login() {
  const api = useApi();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { mutate } = useSWRConfig();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (username, password) => {
      setLoading(true);
      setError(null);

      api
        .post("/auth/token", {
          username,
          password,
        })
        .then((res) => {
          dispatch(
            authSlice.actions.setAuthentication({
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
              principalName: res.data.principal,
            }),
          );
        })
        .then(() => {
          router.push("/");
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            setError("Either username or password are wrong!");
          } else {
            setError("An unexpected error occurred, please retry!");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [api, dispatch, router],
  );

  useEffect(() => {
    const logout = searchParams.get("logout");

    if (logout === "true") {
      dispatch(authSlice.actions.clearAuthentication());
      mutate(() => true, null);
    }
  }, [searchParams, dispatch]);

  return (
    <div
      className="flex min-h-screen grow items-center justify-center overflow-hidden px-4 py-12 lg:justify-end lg:px-0 lg:py-0"
      style={{
        backgroundImage: "url('/images/wave-background.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full max-w-lg flex-col rounded-md bg-white p-8 text-gray-800 opacity-95 shadow backdrop-blur-lg dark:bg-gray-800 dark:text-white lg:min-h-screen lg:max-w-[33%] lg:justify-center lg:rounded-none">
        <div className="mx-auto w-full max-w-lg space-y-6 2xl:max-w-2xl">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-6">
              <Image
                src="/images/logo.svg"
                width={32}
                height={32}
                alt="TaskCare Logo"
                className="h-12 w-12 2xl:h-20 2xl:w-20"
              />
              <h1 className="text-center text-2xl font-bold lg:text-3xl lg:text-4xl 2xl:text-6xl">
                TaskCare
              </h1>
            </div>
            <h3 className="text-center text-lg 2xl:text-2xl">
              Login to continue
            </h3>
          </div>
          {!loading && !error && searchParams.get("logout") === "true" && (
            <p className="text-center text-amber-500 2xl:text-lg">
              You have been logged out
            </p>
          )}
          {error && <p className="text-center text-red-500">{error}</p>}
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={schema}
            onSubmit={(values) => login(values.username, values.password)}
          >
            {(props) => (
              <form
                className="space-y-4"
                onSubmit={props.handleSubmit}
                noValidate
              >
                <div>
                  <TextInput
                    theme={customTextInputTheme}
                    name="username"
                    type="text"
                    placeholder="Username"
                    disabled={loading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.username}
                    color={
                      props.errors.username && props.touched.username
                        ? "failure"
                        : "gray"
                    }
                    helperText={
                      props.errors.username && props.touched.username
                        ? props.errors.username
                        : null
                    }
                  />
                </div>
                <div>
                  <TextInput
                    theme={customTextInputTheme}
                    name="password"
                    type="password"
                    placeholder="Password"
                    disabled={loading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.password}
                    color={
                      props.errors.password && props.touched.password
                        ? "failure"
                        : "gray"
                    }
                    helperText={
                      props.errors.password && props.touched.password
                        ? props.errors.password
                        : null
                    }
                  />
                </div>
                <Button
                  className="w-full bg-amber-500 outline-none hover:!bg-amber-600 focus:ring-0 disabled:hover:!bg-amber-500 dark:bg-amber-500 dark:hover:!bg-amber-600"
                  type="submit"
                  disabled={!(props.isValid && props.dirty) || loading}
                >
                  {!loading && <span>Login</span>}
                  {loading && <Spinner size="sm" className="fill-white" />}
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
