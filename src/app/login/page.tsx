"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik } from "formik";
import * as yup from "yup";
import { Form } from "@/components/atoms/Form";
import { TextField } from "@/components/atoms/TextField";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { useAppDispatch } from "@/store";
import useApi from "@/hooks/useApi";
import authSlice from "@/store/slices/auth";

const schema = yup.object().shape({
  username: yup.string().required("Is required"),
  password: yup.string().required("Is required"),
});

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const api = useApi();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
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
    }
  }, [searchParams, dispatch]);

  return (
    <div
      className="flex grow items-center justify-center overflow-hidden px-4 py-12 lg:justify-end lg:px-0 lg:py-0"
      style={{
        backgroundImage: "url('/images/wave-background.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-lg space-y-8 rounded-md bg-white/75 p-8 text-slate-700 shadow dark:bg-slate-800/90 dark:text-white">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-6">
              <Image
                src="/images/logo.svg"
                width={32}
                height={32}
                alt="TaskCare Logo"
                className="h-12 w-12"
              />
              <h1 className="text-center text-2xl font-bold lg:text-3xl lg:text-4xl">
                TaskCare
              </h1>
            </div>
            <h3 className="text-center text-lg 2xl:text-2xl">
              Login to continue
            </h3>
          </div>
          {!loading && !error && searchParams.get("logout") === "true" && (
            <p className="text-center text-amber-500">
              You have been logged out
            </p>
          )}
          {error && <p className="text-center text-red-500">{error}</p>}
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={schema}
            onSubmit={(values) => login(values)}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} validationBehavior="aria">
                <TextField
                  placeholder="Username"
                  name="username"
                  type="text"
                  isDisabled={loading}
                  value={props.values.username}
                  onBlur={props.handleBlur}
                  onChange={(value) => props.setFieldValue("username", value)}
                  isInvalid={
                    !!props.touched.username && !!props.errors.username
                  }
                  errorMessage={props.errors.username}
                />
                <TextField
                  type="password"
                  value={props.values.password}
                  placeholder="Password"
                  isDisabled={loading}
                  onBlur={props.handleBlur}
                  onChange={(value) => props.setFieldValue("password", value)}
                  isInvalid={
                    !!props.touched.password && !!props.errors.password
                  }
                  errorMessage={props.errors.password}
                />
                <Button type="submit" className="flex justify-center">
                  {!loading && <span>Login</span>}
                  {loading && <Spinner />}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
