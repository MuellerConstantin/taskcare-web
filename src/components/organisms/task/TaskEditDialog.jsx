import { useState, useCallback, useMemo } from "react";
import {
  Button,
  Spinner,
  TextInput,
  Textarea,
  Modal,
  Label,
  Datepicker,
  ButtonGroup,
} from "flowbite-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Formik } from "formik";
import * as yup from "yup";
import useSWR from "swr";
import useApi from "@/hooks/useApi";
import Select from "@/components/atoms/Select";
import Timepicker from "@/components/atoms/Timepicker";

const customButtonTheme = {
  color: {
    amber:
      "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900",
    light:
      "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
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

const customDatepickerTheme = {
  root: {
    input: customTextInputTheme,
  },
  popup: {
    footer: {
      button: {
        base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-amber-300",
        today:
          "bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700",
      },
    },
  },
  views: {
    days: {
      items: {
        item: {
          selected: "bg-amber-700 text-white hover:bg-amber-600",
        },
      },
    },
    months: {
      items: {
        item: {
          selected: "bg-amber-700 text-white hover:bg-amber-600",
        },
      },
    },
    years: {
      items: {
        item: {
          selected: "bg-amber-700 text-white hover:bg-amber-600",
        },
      },
    },
    decades: {
      items: {
        item: {
          selected: "bg-amber-700 text-white hover:bg-amber-600",
        },
      },
    },
  },
};

const schema = yup.object().shape({
  name: yup
    .string()
    .max(255, "Must be 255 characters or less")
    .required("Is required"),
  description: yup.string().max(1024, "Must be 1024 characters or less"),
  statusId: yup
    .object({
      label: yup.string(),
      value: yup.string(),
    })
    .nullable(),
  componentIds: yup.array().of(
    yup.object({
      label: yup.string(),
      value: yup.string(),
    }),
  ),
  dueDate: yup
    .date()
    .min(new Date(), "Must be in the future")
    .nullable()
    .when("dueTime", {
      is: (dueTime) => dueTime && dueTime.length > 0,
      then: (schema) => schema.required("Date is required when time is set"),
      otherwise: (schema) => schema.optional(),
    }),
  dueTime: yup.string().nullable(),
  priority: yup
    .object({
      label: yup.string(),
      value: yup
        .string()
        .oneOf(["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]),
    })
    .nullable(),
});

function StatusSelect({ boardId, ...props }) {
  const api = useApi();

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(
    boardId
      ? `/boards/${boardId}/statuses?perPage=10${searchQuery ? `&search=${searchQuery}` : ""}`
      : null,
    (url) => api.get(url).then((res) => res.data),
    [boardId, searchQuery],
    { keepPreviousData: false },
  );

  const loadOptions = useCallback(
    (_, callback) => {
      if (error) {
        callback({ options: [] });
        return;
      }

      if (!data) {
        callback({ options: [] });
        return;
      }

      callback(
        data?.content?.map((status) => ({
          label: status.name,
          value: status.id,
        })) || [],
      );
    },
    [data, error],
  );

  const handleInputChange = useCallback(
    (newValue) => {
      if (newValue) {
        setSearchQuery(encodeURIComponent(`name=like="%${newValue}%"`));
      } else {
        setSearchQuery(null);
      }
    },
    [setSearchQuery],
  );

  return (
    <Select
      async
      isClearable
      isSearchable
      defaultOptions={
        data?.content?.map((status) => ({
          label: status.name,
          value: status.id,
        })) || []
      }
      loadOptions={loadOptions}
      onInputChange={handleInputChange}
      isLoading={loading}
      {...props}
    />
  );
}

function ComponentsSelect({ boardId, ...props }) {
  const api = useApi();

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(
    boardId
      ? `/boards/${boardId}/components?perPage=10${searchQuery ? `&search=${searchQuery}` : ""}`
      : null,
    (url) => api.get(url).then((res) => res.data),
    [boardId, searchQuery],
    { keepPreviousData: true },
  );

  const loadOptions = useCallback(
    (_, callback) => {
      if (error) {
        callback({ options: [] });
        return;
      }

      if (!data) {
        callback({ options: [] });
        return;
      }

      callback(
        data?.content?.map((status) => ({
          label: status.name,
          value: status.id,
        })) || [],
      );
    },
    [data, error],
  );

  const handleInputChange = useCallback(
    (newValue) => {
      if (newValue) {
        setSearchQuery(encodeURIComponent(`name=like="%${newValue}%"`));
      } else {
        setSearchQuery(null);
      }
    },
    [setSearchQuery],
  );

  return (
    <Select
      async
      isMulti
      isClearable
      isSearchable
      defaultOptions={
        data?.content?.map((status) => ({
          label: status.name,
          value: status.id,
        })) || []
      }
      loadOptions={loadOptions}
      onInputChange={handleInputChange}
      isLoading={loading}
      {...props}
    />
  );
}

function AssigneeSelect({ boardId, ...props }) {
  const api = useApi();

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(
    boardId
      ? `/boards/${boardId}/members?perPage=10${searchQuery ? `&search=${searchQuery}` : ""}`
      : null,
    (url) => api.get(url).then((res) => res.data),
    [boardId, searchQuery],
    { keepPreviousData: false },
  );

  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useSWR(
    data ? data.content.map((member) => `/users/${member.userId}`) : null,
    async (urls) => {
      return await Promise.all(
        urls.map((url) => api.get(url).then((res) => res.data)),
      );
    },
    [data],
  );

  const loadOptions = useCallback(
    (_, callback) => {
      if (error || usersError) {
        callback({ options: [] });
        return;
      }

      if (!data || !usersData) {
        callback({ options: [] });
        return;
      }

      callback(
        usersData?.map((user, index) => ({
          label: user.username,
          value: data.content[index].id,
        })) || [],
      );
    },
    [usersData, data, usersError, error],
  );

  const handleInputChange = useCallback(
    (newValue) => {
      if (newValue) {
        setSearchQuery(encodeURIComponent(`username=like="%${newValue}%"`));
      } else {
        setSearchQuery(null);
      }
    },
    [setSearchQuery],
  );

  return (
    <Select
      async
      isClearable
      isSearchable
      defaultOptions={
        usersData?.map((user, index) => ({
          label: user.username,
          value: data.content[index].id,
        })) || []
      }
      loadOptions={loadOptions}
      onInputChange={handleInputChange}
      isLoading={loading}
      {...props}
    />
  );
}

export default function TaskEditDialog({ taskId, show, onEdit, onClose }) {
  const api = useApi();

  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showDescriptionPreview, setShowDescriptionPreview] = useState(false);

  const priorityOptions = useMemo(() => {
    return [
      { label: "Very Low", value: "VERY_LOW" },
      { label: "Low", value: "LOW" },
      { label: "Medium", value: "MEDIUM" },
      { label: "High", value: "HIGH" },
      { label: "Very High", value: "VERY_HIGH" },
    ];
  }, []);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(taskId ? `/tasks/${taskId}` : null, (url) =>
    api.get(url).then((res) => res.data),
  );

  const {
    data: statusData,
    error: statusError,
    isLoading: statusLoading,
  } = useSWR(
    data ? `/boards/${data.boardId}/statuses/${data.statusId}` : null,
    (url) => api.get(url).then((res) => res.data),
    [data],
  );

  const {
    data: componentsData,
    error: componentsError,
    isLoading: componentsLoading,
  } = useSWR(
    data
      ? data.componentIds.map(
          (componentId) => `/boards/${data.boardId}/components/${componentId}`,
        )
      : null,
    async (urls) => {
      return await Promise.all(
        urls.map((url) => api.get(url).then((res) => res.data)),
      );
    },
    [data],
  );

  const {
    data: assigneeData,
    error: assigneeError,
    isLoading: assigneeLoading,
  } = useSWR(
    data ? `/boards/${data.boardId}/members/${data.assigneeId}` : null,
    (url) => api.get(url).then((res) => res.data),
    [data],
  );

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR(
    assigneeData ? `/users/${assigneeData.userId}` : null,
    (url) => api.get(url).then((res) => res.data),
    [data],
  );

  const editTask = useCallback(
    async (values, { setFieldError }) => {
      setEditLoading(true);
      setEditError(null);

      let dueDate = null;

      if (values.dueDate && (!values.dueTime || values.dueTime.length === 0)) {
        dueDate = values.dueDate.toISOString();
      } else if (values.dueDate && values.dueTime) {
        dueDate = new Date(
          `${values.dueDate.toISOString().split("T")[0]} ${values.dueTime}`,
        ).toISOString();
      }

      api
        .patch(`/tasks/${taskId}`, {
          name: values.name,
          description:
            values.description && values.description.length > 0
              ? values.description
              : null,
          statusId: (values.statusId && values.statusId.value) || null,
          assigneeId: (values.assigneeId && values.assigneeId.value) || null,
          componentIds:
            values.componentIds?.map((component) => component.value) || null,
          priority: (values.priority && values.priority.value) || null,
          dueDate,
        })
        .then(onEdit)
        .catch((err) => {
          if (err.response && err.response.status === 422) {
            err.response.data.details?.forEach((detail) =>
              setFieldError(detail.field, detail.message),
            );
          } else {
            setEditError("An unexpected error occurred, please retry!");
          }
        })
        .finally(() => {
          setEditLoading(false);
        });
    },
    [api, taskId, onEdit],
  );

  return (
    <Modal size="lg" show={show} onClose={onClose}>
      <Modal.Header>Edit Task</Modal.Header>
      <Formik
        initialValues={{
          name: data ? data.name : "",
          description: data ? data.description : "",
          statusId: statusData
            ? { label: statusData.name, value: statusData.id }
            : "",
          assigneeId: userData
            ? { label: userData.username, value: assigneeData.id }
            : "",
          componentIds: componentsData
            ? componentsData.map((component) => ({
                label: component.name,
                value: component.id,
              }))
            : [],
          priority:
            (data?.priority &&
              priorityOptions.find(
                (option) => option.value === data.priority,
              )) ||
            "",
          dueDate: data?.dueDate ? new Date(data.dueDate) : undefined,
          dueTime: data?.dueDate
            ? new Date(data?.dueDate).toTimeString().slice(0, 5)
            : "",
        }}
        validationSchema={schema}
        onSubmit={(values, { setFieldError }) =>
          editTask(values, { setFieldError })
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
                    placeholder="Name"
                    maxLength={255}
                    disabled={editLoading || loading}
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
                <div className="space-y-2">
                  <div>
                    <ButtonGroup>
                      <Button
                        theme={customButtonTheme}
                        color="light"
                        size="xs"
                        onClick={() => setShowDescriptionPreview(false)}
                        className={
                          !showDescriptionPreview &&
                          "bg-gray-100 dark:bg-gray-700"
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        theme={customButtonTheme}
                        color="light"
                        size="xs"
                        onClick={() => setShowDescriptionPreview(true)}
                        className={
                          showDescriptionPreview &&
                          "bg-gray-100 dark:bg-gray-700"
                        }
                      >
                        Preview
                      </Button>
                    </ButtonGroup>
                  </div>
                  {showDescriptionPreview ? (
                    <div className="prose-sm h-64 overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 dark:prose-invert md:prose dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {props.values.description}
                      </Markdown>
                    </div>
                  ) : (
                    <Textarea
                      theme={customTextAreaTheme}
                      rows={4}
                      name="description"
                      placeholder="Description"
                      className="h-64"
                      maxLength={1024}
                      disabled={editLoading || loading}
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
                  )}
                </div>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="task-add-status" value="Select status" />
                </div>
                <StatusSelect
                  id="task-add-status"
                  boardId={data?.boardId}
                  name="statusId"
                  onChange={(option) => props.setFieldValue("statusId", option)}
                  onBlur={() => props.setFieldTouched("statusId", true)}
                  value={props.values.statusId}
                  color={
                    props.errors.statusId && props.touched.statusId
                      ? "failure"
                      : "gray"
                  }
                  helperText={
                    props.errors.statusId && props.touched.statusId
                      ? props.errors.statusId
                      : null
                  }
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="task-add-status"
                    value="Select component(s)"
                  />
                </div>
                <ComponentsSelect
                  id="task-add-components"
                  boardId={data?.boardId}
                  name="componentIds"
                  onChange={(option) =>
                    props.setFieldValue("componentIds", option)
                  }
                  onBlur={() => props.setFieldTouched("componentIds", true)}
                  value={props.values.componentIds}
                  color={
                    props.errors.componentIds && props.touched.componentIds
                      ? "failure"
                      : "gray"
                  }
                  helperText={
                    props.errors.componentIds && props.touched.componentIds
                      ? props.errors.componentIds
                      : null
                  }
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="task-add-assignee" value="Select assignee" />
                </div>
                <AssigneeSelect
                  id="task-add-assignee"
                  boardId={data?.boardId}
                  name="assigneeId"
                  onChange={(option) =>
                    props.setFieldValue("assigneeId", option)
                  }
                  onBlur={() => props.setFieldTouched("assigneeId", true)}
                  value={props.values.assigneeId}
                  color={
                    props.errors.assigneeId && props.touched.assigneeId
                      ? "failure"
                      : "gray"
                  }
                  helperText={
                    props.errors.assigneeId && props.touched.assigneeId
                      ? props.errors.assigneeId
                      : null
                  }
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="task-add-priority" value="Select priority" />
                </div>
                <Select
                  isClearable
                  id="task-add-priority"
                  name="priority"
                  options={priorityOptions}
                  onChange={(option) => props.setFieldValue("priority", option)}
                  onBlur={() => props.setFieldTouched("priority", true)}
                  value={props.values.priority}
                  color={
                    props.errors.priority && props.touched.priority
                      ? "failure"
                      : "gray"
                  }
                  helperText={
                    props.errors.priority && props.touched.priority
                      ? props.errors.priority
                      : null
                  }
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="task-add-due-date" value="Select due date" />
                </div>
                <div id="task-add-due-date" className="flex space-x-2">
                  <Datepicker
                    theme={customDatepickerTheme}
                    name="dueDate"
                    minDate={new Date()}
                    onChange={(date) => props.setFieldValue("dueDate", date)}
                    onBlur={() => props.setFieldTouched("dueDate", true)}
                    value={props.values.dueDate}
                    color={
                      props.errors.dueDate &&
                      (props.touched.dueDate || props.touched.dueTime)
                        ? "failure"
                        : "gray"
                    }
                  />
                  <Timepicker
                    name="dueTime"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.dueTime}
                    color={
                      props.errors.dueTime && props.touched.dueTime
                        ? "failure"
                        : "gray"
                    }
                  />
                </div>
                {props.errors.dueDate &&
                  (props.touched.dueDate || props.touched.dueTime) && (
                    <p className="mt-1 text-red-500">{props.errors.dueDate}</p>
                  )}
                {!props.errors.dueDate &&
                  props.errors.dueTime &&
                  props.touched.dueTime && (
                    <p className="mt-1 text-red-500">{props.errors.dueTime}</p>
                  )}
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
                {!editLoading && <span>Edit Task</span>}
                {editLoading && <Spinner size="sm" className="fill-white" />}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
