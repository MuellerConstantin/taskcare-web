import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import { updateUser } from "../../api/users";

const schema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
});

export default function ChangeAccountNameForm({
  username,
  currentFirstName,
  currentLastName,
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
      firstName: values.firstName === "" ? null : values.firstName,
      lastName: values.lastName === "" ? null : values.lastName,
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
        <h2 className="text-2xl">Change display name</h2>
        <hr className="border-gray-300 dark:border-gray-400 mt-2" />
      </div>
      <p>
        This is the display name consisting of first name and last name which is
        used when viewing your profile. The display name is optional,
        alternatively the username is used. You can remove it at any time.
      </p>
      {error && <p className="text-left text-red-500">{error}</p>}
      {success && (
        <p className="text-left text-green-500">Name changed successfully.</p>
      )}
      <div className="w-full">
        <Formik
          initialValues={{ firstName: "", lastName: "" }}
          onSubmit={onUpdate}
          validationSchema={schema}
        >
          {(props) => (
            <form
              className="flex flex-col w-full space-y-4"
              onSubmit={props.handleSubmit}
              noValidate
            >
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="grow">
                  <TextField
                    type="text"
                    name="firstName"
                    placeholder={currentFirstName || "First Name"}
                    value={props.values.firstName}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.errors.firstName}
                    touched={props.errors.firstName && props.touched.firstName}
                    disabled={disabled || loading}
                  />
                </div>
                <div className="grow">
                  <TextField
                    type="text"
                    name="lastName"
                    placeholder={currentLastName || "Last Name"}
                    value={props.values.lastName}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.errors.lastName}
                    touched={props.errors.lastName && props.touched.lastName}
                    disabled={disabled || loading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="max-w-fit bg-green-500 focus:outline-green-500"
                disabled={!props.isValid || disabled || loading}
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
