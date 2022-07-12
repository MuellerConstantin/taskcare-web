import { useEffect, useState } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import StackTemplate from "../components/templates/StackTemplate";
import TextField from "../components/atoms/TextField";
import Button from "../components/atoms/Button";
import Link from "../components/atoms/Link";
import authSlice from "../store/slices/auth";
import { generateToken, fetchPrincipal } from "../api/auth";

import Logo from "../assets/images/logo.svg";

const schema = yup.object().shape({
  username: yup.string().required("Is required"),
  password: yup.string().required("Is required"),
});

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "TaskCare | Login";
  }, []);

  const onLogin = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const tokenRes = await generateToken(values.username, values.password);

      dispatch(
        authSlice.actions.setAuthentication({
          accessToken: tokenRes.data.accessToken,
          accessExpiresIn: tokenRes.data.accessExpiresIn,
          refreshToken: tokenRes.data.refreshToken,
          refreshExpiresIn: tokenRes.data.refreshExpiresIn,
        })
      );

      const principalRes = await fetchPrincipal(tokenRes.data.subject);

      dispatch(authSlice.actions.setPrincipal(principalRes.data));

      navigate("/overview");
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
  };

  return (
    <StackTemplate>
      <div className="h-full bg-amber-500 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md rounded-md p-8 space-y-6">
          <div>
            <img
              className="mx-auto h-10 md:h-12 lg:h-14 w-auto"
              src={Logo}
              alt="Logo"
            />
            <h1 className="mt-4 text-center lg:text-3xl text-2xl font-bold">
              Sign in to your account
            </h1>
          </div>
          {error && <p className="text-center text-red-500">{error}</p>}
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={schema}
            onSubmit={onLogin}
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
                  type="submit"
                  disabled={!(props.isValid && props.dirty) || loading}
                  className="w-full flex justify-center bg-green-500 focus:outline-green-500"
                >
                  {!loading && <span>Login</span>}
                  {loading && (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                  )}
                </Button>
              </form>
            )}
          </Formik>
          <div className="text-center">
            <Link className="text-sm" to="/register">
              Don&apos;t have an account?
            </Link>
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
