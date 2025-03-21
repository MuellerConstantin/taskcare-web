import { useState, useCallback } from "react";
import Image from "next/image";
import { Button, Spinner, Modal, Label } from "flowbite-react";
import { Formik } from "formik";
import * as yup from "yup";
import useSWR from "swr";
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

const schema = yup.object().shape({
  role: yup
    .object({
      label: yup.string(),
      value: yup.string().oneOf(["ADMINISTRATOR", "MAINTAINER", "MEMBER"]),
    })
    .nullable(),
});

export default function MemberEditDialog({
  show,
  boardId,
  onEdit,
  onClose,
  memberId,
}) {
  const api = useApi();

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(
    boardId && memberId ? `/boards/${boardId}/members/${memberId}` : null,
    (url) => api.get(url).then((res) => res.data),
    [boardId, memberId],
  );

  const editMember = useCallback(
    async ({ role }, { setFieldError }) => {
      setEditLoading(true);
      setEditError(null);

      api
        .patch(`/boards/${boardId}/members/${memberId}`, {
          role: role.value,
        })
        .then(() => onEdit())
        .catch((err) => {
          console.error(err);
          if (err.response && err.response.status === 422) {
            err.response.data.details?.forEach((detail) =>
              setFieldError(detail.field, detail.message),
            );
          } else if (
            err.response &&
            err.response.status === 409 &&
            err.response.data?.error === "BoardMustBeAdministrableError"
          ) {
            setEditError(
              "You cannot remove privileges from the only admin from the board!",
            );
          } else {
            setEditError("An unexpected error occurred, please retry!");
          }
        })
        .finally(() => {
          setEditLoading(false);
        });
    },
    [api, boardId, memberId],
  );

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>Edit Member</Modal.Header>
      <Formik
        initialValues={{ role: null }}
        validationSchema={schema}
        onSubmit={(values, { setFieldError }) =>
          editMember(values, { setFieldError })
        }
      >
        {(props) => (
          <form
            className="grow space-y-4 overflow-y-auto"
            onSubmit={props.handleSubmit}
            noValidate
          >
            <Modal.Body className="flex flex-col space-y-4">
              {editError && (
                <p className="text-center text-red-500">{editError}</p>
              )}
              {error && (
                <p className="text-center text-red-500">
                  An unexpected error occurred, please retry!
                </p>
              )}
              <div className="flex flex-col space-y-6 text-gray-900 dark:text-white">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="user-add-roles" value="Select role" />
                  </div>
                  <Select
                    id="user-add-roles"
                    required
                    name="role"
                    options={[
                      { value: "ADMINISTRATOR", label: "Administrator" },
                      { value: "MAINTAINER", label: "Maintainer" },
                      { value: "MEMBER", label: "Member" },
                    ]}
                    placeholder={
                      [
                        { value: "ADMINISTRATOR", label: "Administrator" },
                        { value: "MAINTAINER", label: "Maintainer" },
                        { value: "MEMBER", label: "Member" },
                      ].find((option) => option.value === data?.role).label ||
                      "Select..."
                    }
                    onChange={(option) => props.setFieldValue("role", option)}
                    onBlur={() => props.setFieldTouched("role", true)}
                    value={props.values.role}
                    color={
                      props.errors.role && props.touched.role
                        ? "failure"
                        : "gray"
                    }
                    helperText={
                      props.errors.role && props.touched.role
                        ? props.errors.role
                        : null
                    }
                  />
                  <div className="mt-2 text-xs">
                    <span className="text-amber-600">Attention: </span>
                    Depending on the role selected, the user is granted
                    extensive rights for the entire board.
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
                disabled={
                  !(props.isValid && props.dirty) || loading || editLoading
                }
              >
                {!editLoading && <span>Edit Member</span>}
                {editLoading && <Spinner size="sm" className="fill-white" />}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
