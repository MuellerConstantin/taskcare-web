import { useState, useCallback } from "react";
import { Button, Spinner, TextInput, Textarea, Modal } from "flowbite-react";
import { Formik } from "formik";
import useSWR from "swr";
import * as yup from "yup";
import useApi from "@/hooks/useApi";

const customButtonTheme = {
  "color": {
    "amber": "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900"
  }
};

const customTextInputTheme = {
  "field": {
    "input": {
      "colors": {
        "gray": "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500"
      }
    }
  }
};

const customTextAreaTheme = {
  "colors": {
    "gray": "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500",
  }
};

const schema = yup.object().shape({
  name: yup.string(),
  description: yup.string()
});

export default function ComponentEditDialog({show, boardId, componentId, onEdit, onClose}) {
  const api = useApi();

  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId && componentId ? `/boards/${boardId}/components/${componentId}` : null,
    (url) => api.get(url).then((res) => res.data));

  const editComponent = useCallback(async ({ name, description }, {setFieldError}) => {
    setEditLoading(true);
    setEditError(null);

    api.patch(`/boards/${boardId}/components/${componentId}`, {
      name: name && name.length > 0 ? name : undefined,
      description: description && description.length > 0 ? description : undefined,
    })
    .then(onEdit)
    .catch((err) => {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field, detail.message)
        );
      } else {
        setEditError("An unexpected editError occurred, please retry!");
      }
    })
    .finally(() => {
      setEditLoading(false);
    });
  }, [api, boardId, componentId]);

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>Edit Component</Modal.Header>
      <Formik
        initialValues={{ name: "", description: "" }}
        validationSchema={schema}
        onSubmit={(values, { setFieldError }) => editComponent(values, { setFieldError })}
      >
        {(props) => (
          <form
            className="space-y-4 overflow-y-auto"
            onSubmit={props.handleSubmit}
            noValidate
          >
            <Modal.Body className="space-y-4 flex flex-col">
              {editError && (
                <p className="text-center text-red-500">{editError}</p>
              )}
              <div className="flex flex-col space-y-6 text-gray-900 dark:text-white">
                <div>
                  <TextInput
                    theme={customTextInputTheme}
                    name="name"
                    type="text"
                    placeholder={data?.name || "Name"}
                    disabled={editLoading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.name}
                    color={props.errors.name && props.touched.name ? "failure" : "gray"}
                    helperText={props.errors.name && props.touched.name ? props.errors.name : null}
                  />
                </div>
                <div>
                  <Textarea
                    theme={customTextAreaTheme}
                    rows={4}
                    name="description"
                    placeholder={data?.description || "Description"}
                    disabled={editLoading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.description}
                    color={props.errors.description && props.touched.description ? "failure" : "gray"}
                    helperText={props.errors.description && props.touched.description ? props.errors.description : null}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-end">
              <Button
                theme={customButtonTheme}
                color="amber"
                type="submit"
                className="w-full"
                disabled={!(props.isValid && props.dirty) || editLoading}
              >
                {!editLoading && <span>Edit Component</span>}
                {editLoading && <Spinner size="sm" className="fill-white" />}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
