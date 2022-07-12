import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import { updateBoard } from "../../api/boards";

const schema = yup.object().shape({
  name: yup.string().required("Is required"),
});

export default function ChangeBoardNameForm({
  boardId,
  currentName,
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
      name: values.name,
    };

    try {
      await updateBoard(boardId, update);

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
        This name is the board&apos;s display name. It doesn&apos;t have to be
        unique, but it helps the human eye with identification.
      </p>
      {error && <p className="text-left text-red-500">{error}</p>}
      {success && (
        <p className="text-left text-green-500">Name changed successfully.</p>
      )}
      <div className="w-full">
        <Formik
          initialValues={{ name: "" }}
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
                    name="name"
                    placeholder={currentName || "Name"}
                    value={props.values.name}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.errors.name}
                    touched={props.errors.name && props.touched.name}
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
