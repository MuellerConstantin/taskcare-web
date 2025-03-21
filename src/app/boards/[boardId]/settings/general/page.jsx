"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { TextInput, Textarea, Button, Label, Spinner } from "flowbite-react";
import { mdiPencil } from "@mdi/js";
import useSWR from "swr";
import { Formik } from "formik";
import * as yup from "yup";
import BoardRemoveDialog from "@/components/organisms/board/BoardRemoveDialog";
import BoardChangeLogoDialog from "@/components/organisms/board/BoardChangeLogoDialog";
import BoardLogo from "@/components/molecules/board/BoardLogo";
import useApi from "@/hooks/useApi";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

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
  name: yup.string().required("Is required"),
  description: yup.string(),
});

function BoardInfoLogo({ boardId }) {
  const [showChangeLogoDialog, setShowChangeLogoDialog] = useState(false);

  return (
    <div className="relative">
      <BoardChangeLogoDialog
        show={showChangeLogoDialog}
        boardId={boardId}
        onClose={() => setShowChangeLogoDialog(false)}
        onChange={() => {
          setShowChangeLogoDialog(false);
          mutate();
        }}
      />
      <BoardLogo boardId={boardId} className="h-32 w-32 rounded-full" />
      <button
        className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 p-0 dark:bg-gray-800"
        onClick={() => setShowChangeLogoDialog(true)}
      >
        <Icon
          path={mdiPencil}
          size={0.75}
          className="text-gray-500 dark:text-gray-400"
        />
      </button>
    </div>
  );
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
    mutate,
  } = useSWR(boardId ? `/boards/${boardId}` : null, (url) =>
    api.get(url).then((res) => res.data),
  );

  const editBoard = useCallback(
    async ({ name, description }, { setFieldError, resetForm }) => {
      setEditLoading(true);
      setEditError(null);

      api
        .patch(`/boards/${boardId}`, {
          name,
          description:
            description && description.length > 0 ? description : null,
        })
        .then(resetForm)
        .then(mutate)
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
    [api, boardId, mutate],
  );

  useEffect(() => {
    if (data && formikRef.current) {
      const formik = formikRef.current;
      const currentValues = formik.values;
      const newValues = { name: data.name, description: data.description };

      if (!formik.touched.name && currentValues.name !== newValues.name) {
        formik.setFieldValue("name", newValues.name);
      }

      if (
        !formik.touched.description &&
        currentValues.description !== newValues.description
      ) {
        formik.setFieldValue("description", newValues.description);
      }
    }
  }, [data]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          General
        </h3>
        <hr />
      </div>
      <div className="flex h-full w-full flex-col space-y-4 lg:flex-row lg:space-y-0">
        <div className="flex flex-col items-center lg:w-[20%] lg:grow lg:pr-4">
          <BoardInfoLogo boardName={data?.name} boardId={boardId} />
          {loading ? (
            <div className="mt-4 h-3 w-1/2 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          ) : error ? (
            <div className="mt-4 h-3 w-1/2 rounded-full bg-red-200 dark:bg-red-400" />
          ) : (
            <div className="mt-4 w-full truncate text-center text-lg font-semibold text-gray-900 dark:text-white">
              {data?.name}
            </div>
          )}
        </div>
        <div className="flex flex-col lg:w-[80%] lg:grow">
          {loading ? (
            <div>
              <div className="space-y-2">
                <span className="block text-sm text-gray-900 dark:text-white">
                  Name
                </span>
                <div className="h-8 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="space-y-2">
                <span className="block text-sm text-gray-900 dark:text-white">
                  Description
                </span>
                <div className="h-32 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ) : error ? (
            <div>
              <div className="space-y-2">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Name:
                </span>
                <div className="h-2.5 w-32 rounded-full bg-red-200 dark:bg-red-400" />
              </div>
              <div className="space-y-2">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Description:
                </span>
                <div className="h-2.5 w-64 rounded-full bg-red-200 dark:bg-red-400" />
                <div className="h-2.5 w-64 rounded-full bg-red-200 dark:bg-red-400" />
                <div className="h-2.5 w-64 rounded-full bg-red-200 dark:bg-red-400" />
              </div>
            </div>
          ) : (
            <Formik
              innerRef={formikRef}
              initialValues={{
                name: data?.name || "",
                description: data?.description || "",
              }}
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
                  {editError && <div className="text-red-500">{editError}</div>}
                  <Button
                    theme={customButtonTheme}
                    className="w-fit bg-amber-500 outline-none hover:!bg-amber-600 focus:ring-0 disabled:hover:!bg-amber-500 dark:bg-amber-500 dark:hover:!bg-amber-600"
                    type="submit"
                    disabled={
                      !(props.isValid && props.dirty) || loading || editLoading
                    }
                  >
                    {!editLoading && <span>Update</span>}
                    {editLoading && (
                      <Spinner size="sm" className="fill-white" />
                    )}
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
        <h3 className="text-xl font-semibold text-red-500">Danger Zone</h3>
        <hr />
      </div>
      <div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h5 className="text font-semibold text-gray-900 dark:text-white">
              Delete Board
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete the
              board and all its data, including tasks and statuses as well as
              assigned memberships.
            </p>
          </div>
          <div className="shrink-0">
            <Button
              theme={customButtonTheme}
              className="w-fit bg-red-500 outline-none hover:!bg-red-600 focus:ring-0 disabled:hover:!bg-red-500 dark:bg-red-500 dark:hover:!bg-red-600"
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
