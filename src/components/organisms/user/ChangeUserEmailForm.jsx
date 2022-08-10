import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import TextField from "../../atoms/TextField";
import Button from "../../atoms/Button";
import { updateUser } from "../../../api/users";

const schema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Is required"),
});

export default function ChangeUserEmailForm({
  username,
  currentEmail,
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
      email: values.email,
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
        <h2 className="text-2xl">Change e-mail</h2>
        <hr className="border-gray-300 dark:border-gray-400 mt-2" />
      </div>
      <p>
        Change the E-Mail address under which you want to be reachable and which
        is used to restore your account. This email address will not be visible
        to other users.
      </p>
      {error && <p className="text-left text-red-500">{error}</p>}
      {success && (
        <p className="text-left text-green-500">E-Mail changed successfully.</p>
      )}
      <div className="w-full">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={onUpdate}
          validationSchema={schema}
        >
          {(props) => (
            <form
              className="flex flex-col w-full space-y-4"
              onSubmit={props.handleSubmit}
              noValidate
            >
              <div className="grow">
                <TextField
                  type="email"
                  name="email"
                  placeholder={currentEmail || "Email"}
                  value={props.values.email}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  error={props.errors.email}
                  touched={props.errors.email && props.touched.email}
                  disabled={disabled || loading}
                />
              </div>
              <Button
                type="submit"
                className="max-w-fit bg-green-500 focus:outline-green-500"
                disabled={
                  !(props.isValid && props.dirty) || disabled || loading
                }
              >
                {!loading && <span>Change</span>}
                {loading && (
                  <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                )}
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
