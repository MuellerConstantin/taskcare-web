import { useState, useCallback } from "react";
import { Button, Spinner, TextInput, Textarea, Modal, Label, Select } from "flowbite-react";
import { Formik } from "formik";
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
  name: yup.string().required("Is required"),
  description: yup.string(),
  category: yup.string().required("Is required").oneOf(["TO_DO", "IN_PROGRESS", "DONE"]),
});

export default function StatusAddDialog({show, boardId, onAdd, onClose}) {
  const api = useApi();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addStatus = useCallback(async ({ name, description, category }, {setFieldError}) => {
    setLoading(true);
    setError(null);

    api.post(`/boards/${boardId}/statuses`, {
      name,
      description: description && description.length > 0 ? description : null,
      category
    })
    .then(onAdd)
    .catch((err) => {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field, detail.message)
        );
      } else {
        setError("An unexpected error occurred, please retry!");
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [api, boardId]);

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>Add Status</Modal.Header>
      <Formik
        initialValues={{ name: "", description: "", category: "TO_DO" }}
        validationSchema={schema}
        onSubmit={(values, { setFieldError }) => addStatus(values, { setFieldError })}
      >
        {(props) => (
          <form
            className="space-y-4 overflow-y-auto"
            onSubmit={props.handleSubmit}
            noValidate
          >
            <Modal.Body className="space-y-4 flex flex-col">
              {error && (
                <p className="text-center text-red-500">{error}</p>
              )}
              <div className="flex flex-col space-y-6 text-gray-900 dark:text-white">
                <div>
                  <TextInput
                    theme={customTextInputTheme}
                    name="name"
                    type="text"
                    placeholder="Name"
                    disabled={loading}
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
                    placeholder="Description"
                    disabled={loading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.description}
                    color={props.errors.description && props.touched.description ? "failure" : "gray"}
                    helperText={props.errors.description && props.touched.description ? props.errors.description : null}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="status-add-category" value="Select category" />
                  </div>
                  <Select
                    id="status-add-category"
                    required
                    name="category"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.category}
                    color={props.errors.category && props.touched.category ? "failure" : "gray"}
                    helperText={props.errors.category && props.touched.category ? props.errors.category : null}
                  >
                    <option>TO_DO</option>
                    <option>IN_PROGRESS</option>
                    <option>DONE</option>
                  </Select>
                  <div className="text-xs mt-2">
                    <span className="text-amber-600">Attention: </span>
                    Depending on the category selected, different worklfows will be applied.
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-end">
              <Button
                theme={customButtonTheme}
                color="amber"
                type="submit"
                className="w-full"
                disabled={!(props.isValid && props.dirty) || loading}
              >
                {!loading && <span>Add Status</span>}
                {loading && <Spinner size="sm" className="fill-white" />}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
