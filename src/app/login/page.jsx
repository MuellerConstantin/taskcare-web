"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import StackTemplate from "@/components/templates/StackTemplate";
import { Button, Spinner } from "flowbite-react";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import authSlice from "@/store/slices/auth";
import TextField from "@/components/atoms/TextField";
import useApi from "@/hooks/useApi";

const schema = yup.object().shape({
  username: yup.string().required("Is required"),
  password: yup.string().required("Is required"),
});

export default function Login() {
  const api = useApi();
  const router = useRouter();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (values) => {
    setLoading(true);
    setError(null);

    try {
      const tokenRes = await api.post("/auth/token", {
        username: values.username,
        password: values.password,
      });

      dispatch(authSlice.actions.setAuthentication({
        accessToken: tokenRes.data.accessToken,
        refreshToken: tokenRes.data.refreshToken
      }));

      router.push("/");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Either username or password are wrong!");
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, dispatch, router]);

  return (
    <StackTemplate>
      <div className="grow flex items-center justify-center px-4 py-12 relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#f59e0b] to-[#92400e] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{clipPath: "polygon(54.1% 33.1%, 100% 61.6%, 97.5% 36.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 55.5%, 60.2% 33.4%, 52.4% 68.1%, 47.5% 77.3%, 45.2% 34.5%, 23.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}>
          </div>
        </div>
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-white p-8 space-y-6">
          <div className="flex flex-col space-y-8">
            <div className="flex space-x-4 justify-center items-center">
              <Image
                src="/images/logo.svg"
                width={32}
                height={32}
                alt="TaskCare Logo"
                className="h-12 w-12"
              />
              <h1 className="text-center lg:text-3xl text-2xl font-bold">
                TaskCare
              </h1>
            </div>
            <h3 className="text-center text-lg">
              Login to continue
            </h3>
          </div>
          {error && <p className="text-center text-red-500">{error}</p>}
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <form
                className="space-y-4"
                onSubmit={props.handleSubmit}
                noValidate
              >
                <div>
                  <TextField
                    name="username"
                    type="text"
                    placeholder="Username"
                    disabled={loading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.username}
                    error={props.errors.username}
                    touched={props.errors.username && props.touched.username}
                  />
                </div>
                <div>
                  <TextField
                    name="password"
                    type="password"
                    placeholder="Password"
                    disabled={loading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.password}
                    error={props.errors.password}
                    touched={props.errors.password && props.touched.password}
                  />
                </div>
                <Button
                  className="w-full bg-amber-500 dark:bg-amber-500 hover:!bg-amber-600 dark:hover:!bg-amber-600 disabled:hover:!bg-amber-500 outline-none focus:ring-0"
                  type="submit"
                  disabled={!(props.isValid && props.dirty) || loading}
                >
                  {!loading && <span>Login</span>}
                  {loading && <Spinner className="fill-white" />}
                </Button>
              </form>
            )}
          </Formik>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#f59e0b] to-[#92400e] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 45.9%, 56.5% 0.1%, 80.7% 2%, 32.5% 32.5%, 43.2% 62.4%, 45.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}>
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
