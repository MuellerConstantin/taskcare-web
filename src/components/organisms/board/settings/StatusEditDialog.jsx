import { useState, useCallback } from "react";
import {
  Button,
  Spinner,
  TextInput,
  Textarea,
  Modal,
  Label,
} from "flowbite-react";
import { Formik } from "formik";
import useSWR from "swr";
import * as yup from "yup";
import useApi from "@/hooks/useApi";
import Select from "@/components/atoms/Select";

const customButtonTheme = {
  color: {
    amber:
      "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900",
  },
};

const customTextInputTheme = {
  field: {
    input: {
      colors: {
        gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500",
      },
    },
  },
};

const customTextAreaTheme = {
  colors: {
    gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500",
  },
};

const schema = yup.object().shape({
  name: yup.string(),
  description: yup.string(),
  category: yup
    .object({
      label: yup.string(),
      value: yup.string().oneOf(["TO_DO", "IN_PROGRESS", "DONE"]),
    })
    .nullable(),
});

export default function StatusEditDialog({
  show,
  boardId,
  statusId,
  onEdit,
  onClose,
}) {
  const api = useApi();

  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(
    boardId && statusId ? `/boards/${boardId}/statuses/${statusId}` : null,
    (url) => api.get(url).then((res) => res.data),
  );

  const editStatus = useCallback(
    async ({ name, description, category }, { setFieldError }) => {
      setEditLoading(true);
      setEditError(null);

      api
        .patch(`/boards/${boardId}/statuses/${statusId}`, {
          name: name && name.length > 0 ? name : undefined,
          description:
            description && description.length > 0 ? description : undefined,
          category: category && category.value,
        })
        .then(onEdit)
        .catch((err) => {
          if (err.response && err.response.status === 422) {
            err.response.data.details?.forEach((detail) =>
              setFieldError(detail.field, detail.message),
            );
          } else {
            setEditError("An unexpected editError occurred, please retry!");
          }
        })
        .finally(() => {
          setEditLoading(false);
        });
    },
    [api, boardId, statusId],
  );

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>Edit Status</Modal.Header>
      <Formik
        initialValues={{ name: "", description: "", category: null }}
        validationSchema={schema}
        onSubmit={(values, { setFieldError }) =>
          editStatus(values, { setFieldError })
        }
      >
        {(props) => (
          <form
            className="space-y-4 overflow-y-auto"
            onSubmit={props.handleSubmit}
            noValidate
          >
            <Modal.Body className="flex flex-col space-y-4">
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
                    color={
                      props.errors.name && props.touched.name
                        ? "failure"
                        : "gray"
                    }
                    helperText={
                      props.errors.name && props.touched.name
                        ? props.errors.name
                        : null
                    }
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
                    color={
                      props.errors.description && props.touched.description
                        ? "failure"
                        : "gray"
                    }
                    helperText={
                      props.errors.description && props.touched.description
                        ? props.errors.description
                        : null
                    }
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="status-add-category"
                      value="Select category"
                    />
                  </div>
                  <Select
                    id="status-add-category"
                    required
                    name="category"
                    options={[
                      { value: "TO_DO", label: "To Do" },
                      { value: "IN_PROGRESS", label: "In Progress" },
                      { value: "DONE", label: "Done" },
                    ]}
                    placeholder={
                      [
                        { value: "TO_DO", label: "To Do" },
                        { value: "IN_PROGRESS", label: "In Progress" },
                        { value: "DONE", label: "Done" },
                      ].find((option) => option.value === data?.category)
                        .label || "Select..."
                    }
                    onChange={(option) =>
                      props.setFieldValue("category", option)
                    }
                    onBlur={() => props.setFieldTouched("category")}
                    value={props.values.category}
                    color={
                      props.errors.category && props.touched.category
                        ? "failure"
                        : "gray"
                    }
                    helperText={
                      props.errors.category && props.touched.category
                        ? props.errors.category
                        : null
                    }
                  />
                  <div className="mt-2 text-xs">
                    <span className="text-amber-600">Attention: </span>
                    Depending on the category selected, different worklfows will
                    be applied.
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
                disabled={!(props.isValid && props.dirty) || editLoading}
              >
                {!editLoading && <span>Edit Status</span>}
                {editLoading && <Spinner size="sm" className="fill-white" />}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
