import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import BoardDeletionModal from "./BoardDeletionModal";
import { updateBoard } from "../../api/boards";

const nameSchema = yup.object().shape({
  name: yup.string().required("Is required"),
});

const descriptionSchema = yup.object().shape({
  description: yup.string(),
});

export default function BoardSettings({ board, onSuccess }) {
  const navigate = useNavigate();

  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState(null);

  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [descriptionSuccess, setDescriptionSuccess] = useState(false);
  const [descriptionError, setDescriptionError] = useState(null);

  const onUpdateName = async (values, { setFieldError, resetForm }) => {
    setNameLoading(true);
    setNameSuccess(false);
    setNameError(null);

    const update = {
      name: values.name,
    };

    try {
      await updateBoard(board.id, update);

      setNameSuccess(true);
      resetForm();

      if (onSuccess()) onSuccess();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field.split(".").pop(), detail.message)
        );
      } else if (err.response && err.response.status === 401) {
        navigate("/logout");
      } else {
        setNameError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setNameLoading(false);
    }
  };

  const onUpdateDescription = async (values, { setFieldError, resetForm }) => {
    setDescriptionLoading(true);
    setDescriptionSuccess(false);
    setDescriptionError(null);

    const update = {
      description: values.description === "" ? null : values.description,
    };

    try {
      await updateBoard(board.id, update);

      setDescriptionSuccess(true);
      resetForm();

      if (onSuccess()) onSuccess();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field.split(".").pop(), detail.message)
        );
      } else if (err.response && err.response.status === 401) {
        navigate("/logout");
      } else {
        setDescriptionError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setDescriptionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl">Change display name</h2>
          <hr className="border-gray-300 dark:border-gray-400 mt-2" />
        </div>
        <p>
          This name is the board&apos;s display name. It doesn&apos;t have to be
          unique, but it helps the human eye with identification.
        </p>
        {nameError && <p className="text-left text-red-500">{nameError}</p>}
        {nameSuccess && (
          <p className="text-left text-green-500">Name changed successfully.</p>
        )}
        <div className="w-full">
          <Formik
            initialValues={{ name: "" }}
            onSubmit={onUpdateName}
            validationSchema={nameSchema}
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
                      placeholder={board.name || "Name"}
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={props.errors.name}
                      touched={props.errors.name && props.touched.name}
                      disabled={nameLoading || descriptionLoading}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="max-w-fit bg-green-500 focus:outline-green-500"
                  disabled={!props.isValid || nameLoading || descriptionLoading}
                >
                  {!nameLoading && <span>Change</span>}
                  {nameLoading && (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                  )}
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl">Change description</h2>
          <hr className="border-gray-300 dark:border-gray-400 mt-2" />
        </div>
        <p>This is an optional description with details about the board.</p>
        {descriptionError && (
          <p className="text-left text-red-500">{descriptionError}</p>
        )}
        {descriptionSuccess && (
          <p className="text-left text-green-500">
            Description changed successfully.
          </p>
        )}
        <div className="w-full">
          <Formik
            initialValues={{ description: "" }}
            onSubmit={onUpdateDescription}
            validationSchema={descriptionSchema}
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
                      name="description"
                      placeholder={board.description || "Description"}
                      value={props.values.description}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={props.errors.description}
                      touched={
                        props.errors.description && props.touched.description
                      }
                      disabled={nameLoading || descriptionLoading}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="max-w-fit bg-green-500 focus:outline-green-500"
                  disabled={!props.isValid || nameLoading || descriptionLoading}
                >
                  {!descriptionLoading && <span>Change</span>}
                  {descriptionLoading && (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                  )}
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl text-red-500">Delete this board</h2>
          <hr className="border-red-500 mt-2" />
        </div>
        <p>
          This will permanently delete this board. Warning, this cannot be
          undone. All created tasks are irrevocably lost.
        </p>
        <div className="w-full">
          <BoardDeletionModal
            id={board.id}
            onSuccess={() => navigate("/overview")}
          >
            <Button
              type="button"
              disabled={nameLoading || descriptionLoading}
              className="bg-red-500 focus:outline-red-500"
            >
              Delete this board
            </Button>
          </BoardDeletionModal>
        </div>
      </div>
    </div>
  );
}
