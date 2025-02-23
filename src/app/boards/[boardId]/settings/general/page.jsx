"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { TextInput, Textarea, Button, Label, Spinner } from "flowbite-react";
import useSWR from "swr";
import { Formik } from "formik";
import * as yup from "yup";
import BoardRemoveDialog from "@/components/organisms/board/BoardRemoveDialog";
import IdentIcon from "@/components/atoms/IdentIcon";
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
  description: yup.string()
});

function BoardInfoLogo({boardName, boardId}) {
  const api = useApi();

  const {
    data
  } = useSWR(boardId ? `/boards/${boardId}/logo-image` : null,
    (url) => api.get(url, {responseType: "arraybuffer"})
      .then((res) => URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }))));

  if (data) {
    return (
      <div className="rounded-full bg-gray-200 dark:bg-gray-800 w-32 h-32 relative overflow-hidden">
        <Image
          src={data}
          alt={boardName}
          fill
          objectFit="cover"
          layout="fill"
        />
      </div>
    );
  } else {
    return (
      <div className="rounded-full bg-gray-200 dark:bg-gray-800 w-32 h-32 overflow-hidden">
        <IdentIcon value={boardName} />
      </div>
    );
  }
}

export default function BoardSettingsGeneral() {
  const { boardId } = useParams();
  const router = useRouter();
  const api = useApi();

  const formikRef = useRef(null);

  const [showRemoveBoardDialog, setShowRemoveBoardDialog] = useState(false);

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const {
    data,
    error,
    isLoading: loading,
    mutate
  } = useSWR(boardId ? `/boards/${boardId}` : null,
    (url) => api.get(url).then((res) => res.data));

  const editBoard = useCallback(async ({ name, description }, {setFieldError, resetForm}) => {
    setEditLoading(true);
    setEditError(null);

    api.patch(`/boards/${boardId}`, {
      name,
      description: description && description.length > 0 ? description : null,
    })
    .then(resetForm)
    .then(mutate)
    .catch((err) => {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field, detail.message)
        );
      } else {
        setEditError("An unexpected error occurred, please retry!");
      }
    })
    .finally(() => {
      setEditLoading(false);
    });
  }, [api, boardId, mutate]);

  useEffect(() => {
    if (data && formikRef.current) {
      const formik = formikRef.current;
      const currentValues = formik.values;
      const newValues = { name: data.name, description: data.description };
  
      if (!formik.touched.name && currentValues.name !== newValues.name) {
        formik.setFieldValue("name", newValues.name);
      }

      if (!formik.touched.description && currentValues.description !== newValues.description) {
        formik.setFieldValue("description", newValues.description);
      }
    }
  }, [data]);

  return (
    <div className="space-y-4 flex flex-col">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          General
        </h3>
        <hr />
      </div>
      <div className="h-full w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0">
        <div className="lg:grow lg:w-[20%] flex flex-col items-center lg:pr-4">
          <BoardInfoLogo boardName={data?.name} boardId={boardId} />
          {loading ? (
            <div className="animate-pulse h-3 bg-gray-200 rounded-full dark:bg-gray-800 w-1/2 mt-4" />
          ) : error ? (
            <div className="h-3 bg-red-200 dark:bg-red-400 rounded-full w-1/2 mt-4" />
          ) : (
            <div className="mt-4 text-lg font-semibold truncate w-full text-center text-gray-900 dark:text-white">{data?.name}</div>
          )}
        </div>
        <div className="lg:grow lg:w-[80%] flex flex-col">
          {loading ? (
            <div>
              <div className="space-y-2">
                <span className="block text-sm text-gray-900 dark:text-white">Name</span>
                <div className="animate-pulse h-8 bg-gray-200 rounded-md dark:bg-gray-800 w-full" />
              </div>
              <div className="space-y-2">
                <span className="block text-sm text-gray-900 dark:text-white">Description</span>
                <div className="animate-pulse h-32 bg-gray-200 rounded-md dark:bg-gray-800 w-full" />
              </div>
            </div>
          ) : error ? (
            <div>
              <div className="space-y-2">
                <span className="block text-sm text-gray-900 dark:text-white font-semibold">Name:</span>
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-32" />
              </div>
              <div className="space-y-2">
                <span className="block text-sm text-gray-900 dark:text-white font-semibold">Description:</span>
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-64" />
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-64" />
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-64" />
              </div>
            </div>
          ) : (
            <Formik
              innerRef={formikRef}
              initialValues={{ name: data?.name || "", description: data?.description || "" }}
              validationSchema={schema}
              onSubmit={(values, actions) => editBoard(values, actions)}
            >
              {(props) => (
                <form
                  className="space-y-4"
                  onSubmit={props.handleSubmit}
                  noValidate
                >
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="name-input" value="Name" />
                    </div>
                    <TextInput
                      id="name-input"
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
                    <div className="mb-2 block">
                      <Label htmlFor="description-input" value="Description" />
                    </div>
                    <Textarea
                      id="description-input"
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
                  {editError && <div className="text-red-500">{editError}</div>}
                  <Button
                    theme={customButtonTheme}
                    className="w-fit bg-amber-500 dark:bg-amber-500 hover:!bg-amber-600 dark:hover:!bg-amber-600 disabled:hover:!bg-amber-500 outline-none focus:ring-0"
                    type="submit"
                    disabled={!(props.isValid && props.dirty) || loading || editLoading}
                  >
                    {!editLoading && <span>Update</span>}
                    {editLoading && <Spinner size="sm" className="fill-white" />}
                  </Button>
                </form>
              )}
            </Formik>
          )}
        </div>
      </div>
      <BoardRemoveDialog
        show={showRemoveBoardDialog}
        onClose={() => setShowRemoveBoardDialog(false)}
        onRemove={() => {
          router.push("/");
        }}
        boardId={boardId}
      />
      <div className="space-y-1">
        <h3 className="text-xl text-red-500 font-semibold">
          Danger Zone
        </h3>
        <hr />
      </div>
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h5 className="text font-semibold text-gray-900 dark:text-white">Delete Board</h5>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              This action cannot be undone. This will permanently delete the board and all its data, including
              tasks and statuses as well as assigned memberships.
            </p>
          </div>
          <div className="shrink-0">
            <Button
              theme={customButtonTheme}
              className="w-fit bg-red-500 dark:bg-red-500 hover:!bg-red-600 dark:hover:!bg-red-600 disabled:hover:!bg-red-500 outline-none focus:ring-0"
              onClick={() => setShowRemoveBoardDialog(true)}
            >
              Delete Board
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
