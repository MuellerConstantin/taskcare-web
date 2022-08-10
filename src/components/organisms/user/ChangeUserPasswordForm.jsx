import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import TextField from "../../atoms/TextField";
import Button from "../../atoms/Button";
import { updateUser } from "../../../api/users";

const schema = yup.object().shape({
  password: yup.string().required("Is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Is required"),
});

export default function ChangeUserPasswordForm({
  username,
  onChange,
  disabled,
}) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const onUpdate = async (values, { setFieldError, resetForm }) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    const update = {
      password: values.password,
    };

    try {
      await updateUser(username, update);

      setSuccess(true);
      resetForm();

      if (onChange) onChange();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field.split(".").pop(), detail.message)
        );
      } else if (err.response && err.response.status === 401) {
        navigate("/logout");
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-800 dark:text-white space-y-4">
      <div>
        <h2 className="text-2xl">Change password</h2>
        <hr className="border-gray-300 dark:border-gray-400 mt-2" />
      </div>
      <p>
        Change your account password. The new password will take effect the next
        time you log in.
      </p>
      {error && <p className="text-left text-red-500">{error}</p>}
      {success && (
        <p className="text-left text-green-500">
          Password changed successfully.
        </p>
      )}
      <div className="w-full">
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          onSubmit={onUpdate}
          validationSchema={schema}
        >
          {(props) => (
            <form
              className="flex flex-col w-full space-y-4"
              onSubmit={props.handleSubmit}
              noValidate
            >
              <div>
                <TextField
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={props.values.password}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  error={props.errors.password}
                  touched={props.errors.password && props.touched.password}
                  disabled={disabled || loading}
                  className="grow"
                />
              </div>
              <div>
                <TextField
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={props.values.confirmPassword}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  error={props.errors.confirmPassword}
                  touched={
                    props.errors.confirmPassword &&
                    props.touched.confirmPassword
                  }
                  disabled={disabled || loading}
                  className="grow"
                />
              </div>
              <Button
                type="submit"
                disabled={
                  !(props.isValid && props.dirty) || disabled || loading
                }
                className="max-w-fit bg-green-500 focus:outline-green-500"
              >
                Change
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
