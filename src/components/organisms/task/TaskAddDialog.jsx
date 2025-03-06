import { useState, useCallback } from "react";
import { Button, Spinner, TextInput, Textarea, Modal, Label } from "flowbite-react";
import { Formik } from "formik";
import * as yup from "yup";
import useSWR from "swr";
import useApi from "@/hooks/useApi";
import Select from "@/components/atoms/Select";

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
  statusId: yup.object({
    label: yup.string(),
    value: yup.string()
  }).nullable(),
  componentIds: yup.array().of(yup.object({
    label: yup.string(),
    value: yup.string()
  })),
  priority: yup.object({
    label: yup.string(),
    value: yup.string().oneOf(["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"])
  }).nullable()
});

function StatusSelect({boardId, ...props}) {
  const api = useApi();

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId ? `/boards/${boardId}/statuses?perPage=10${searchQuery ? `&search=${searchQuery}` : ""}` : null,
    (url) => api.get(url).then((res) => res.data), [boardId, searchQuery], { keepPreviousData: false });

  const loadOptions = useCallback((_, callback) => {
    if (error) {
      callback({ options: [] });
      return;
    }
  
    if (!data) {
      callback({ options: [] });
      return;
    }
  
    callback(data?.content?.map(status => ({
        label: status.name,
        value: status.id
    })) || []);
  }, [data, error]);

  const handleInputChange = useCallback((newValue) => {
    if(newValue) {
      setSearchQuery(encodeURIComponent(`name=like="%${newValue}%"`));
    } else {
      setSearchQuery(null);
    }
  }, [setSearchQuery]);

  return (
    <Select
      async
      isClearable
      isSearchable
      defaultOptions={data?.content?.map((status) => ({
        label: status.name,
        value: status.id,
      })) || []}
      loadOptions={loadOptions}
      onInputChange={handleInputChange}
      isLoading={loading}
      {...props}
    />
  );
}

function ComponentsSelect({boardId, ...props}) {
  const api = useApi();

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId ? `/boards/${boardId}/components?perPage=10${searchQuery ? `&search=${searchQuery}` : ""}` : null,
    (url) => api.get(url).then((res) => res.data), [boardId, searchQuery], { keepPreviousData: true });

  const loadOptions = useCallback((_, callback) => {
    if (error) {
      callback({ options: [] });
      return;
    }
  
    if (!data) {
      callback({ options: [] });
      return;
    }
  
    callback(data?.content?.map(status => ({
        label: status.name,
        value: status.id
    })) || []);
  }, [data, error]);

  const handleInputChange = useCallback((newValue) => {
    if(newValue) {
      setSearchQuery(encodeURIComponent(`name=like="%${newValue}%"`));
    } else {
      setSearchQuery(null);
    }
  }, [setSearchQuery]);

  return (
    <Select
      async
      isMulti
      isClearable
      isSearchable
      defaultOptions={data?.content?.map((status) => ({
        label: status.name,
        value: status.id,
      })) || []}
      loadOptions={loadOptions}
      onInputChange={handleInputChange}
      isLoading={loading}
      {...props}
    />
  );
}

export default function TaskAddDialog({boardId, show, onAdd, onClose}) {
  const api = useApi();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addTask = useCallback(async (values, {setFieldError}) => {
    setLoading(true);
    setError(null);

    api.post(`/boards/${boardId}/tasks`, {
      name: values.name,
      description: values.description && values.description.length > 0 ? values.description : null,
      statusId: values.statusId && values.statusId.value || null,
      componentIds: values.componentIds?.map((component) => component.value) || null,
      priority: values.priority && values.priority.value || null
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
  }, [api, boardId, onAdd]);

  return (
    <Modal size="lg" show={show} onClose={onClose}>
      <Modal.Header>Add Task</Modal.Header>
      <Formik
        initialValues={{ name: "", description: "", statusId: "", componentIds: [], priority: "" }}
        validationSchema={schema}
        onSubmit={(values, { setFieldError }) => addTask(values, { setFieldError })}
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
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="task-add-status" value="Select status" />
                </div>
                <StatusSelect
                  id="task-add-status"
                  boardId={boardId}
                  name="statusId"
                  onChange={(option) => props.setFieldValue("statusId", option)}
                  onBlur={() => props.setFieldTouched("statusId", true)}
                  value={props.values.statusId}
                  color={props.errors.statusId && props.touched.statusId ? "failure" : "gray"}
                  helperText={props.errors.statusId && props.touched.statusId ? props.errors.statusId : null}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="task-add-status" value="Select component(s)" />
                </div>
                <ComponentsSelect
                  id="task-add-components"
                  boardId={boardId}
                  name="componentIds"
                  onChange={(option) => props.setFieldValue("componentIds", option)}
                  onBlur={() => props.setFieldTouched("componentIds", true)}
                  value={props.values.componentIds}
                  color={props.errors.componentIds && props.touched.componentIds ? "failure" : "gray"}
                  helperText={props.errors.componentIds && props.touched.componentIds ? props.errors.componentIds : null}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="task-add-priority" value="Select priority" />
                </div>
                <Select
                  id="task-add-priority"
                  name="priority"
                  options={[
                    {"label": "Very Low", "value": "VERY_LOW"},
                    {"label": "Low", "value": "LOW"},
                    {"label": "Medium", "value": "MEDIUM"},
                    {"label": "High", "value": "HIGH"},
                    {"label": "Very High", "value": "VERY_HIGH"},
                  ]}
                  onChange={(option) => props.setFieldValue("priority", option)}
                  onBlur={() => props.setFieldTouched("priority", true)}
                  value={props.values.priority}
                  color={props.errors.priority && props.touched.priority ? "failure" : "gray"}
                  helperText={props.errors.priority && props.touched.priority ? props.errors.priority : null}
                />
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
                {!loading && <span>Add Task</span>}
                {loading && <Spinner size="sm" className="fill-white" />}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
