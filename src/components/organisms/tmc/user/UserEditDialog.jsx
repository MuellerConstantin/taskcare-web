import { useState, useCallback } from "react";
import Image from "next/image";
import { Button, Spinner, Avatar, TextInput, Modal, Label, Select } from "flowbite-react";
import { Formik } from "formik";
import * as yup from "yup";
import useSWR from "swr";
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

const schema = yup.object().shape({
  displayName: yup.string(),
  password: yup.string(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
  role: yup.string().oneOf(["ADMINISTRATOR", "USER"]),
});

function UserEditDialogAvatar({username, userId}) {
  const api = useApi();

  const {
    data,
    isLoading: loading
  } = useSWR(userId ? `/users/${userId}/profile-image` : null,
    (url) => api.get(url, {responseType: "arraybuffer"})
      .then((res) => URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }))));

  if(loading || !username) {
    return (
      <div className="animate-pulse">
        <Avatar size="lg" rounded />
      </div>
    );
  } else {
    if (data) {
      return (
        <Avatar
          size="lg"
          className="bg-gray-200 dark:bg-gray-900 rounded-full"
          rounded
          img={({className, ...props}) => (
            <Image
              src={data}
              alt={username}
              width={64}
              height={64}
              className={`${className} object-cover`}
              {...props}
            />
          )}
        />
      )
    } else {
      return (
        <Avatar size="lg" placeholderInitials={username.slice(0, 2).toUpperCase()} rounded />
      );
    }
  }
}

export default function UserEditDialog({show, importedUser, onEdit, onClose, userId}) {
  const api = useApi();

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(userId ? `/users/${userId}` : null,
    (url) => api.get(url).then((res) => res.data));

  const editUser = useCallback(async ({ displayName, password, role }, { setFieldError }) => {
    setEditLoading(true);
    setEditError(null);

    api.patch(`/users/${userId}`, {
      displayName: displayName && displayName.length > 0 ? displayName : undefined,
      password: password && password.length > 0 ? password : undefined,
      role: role
    })
    .then(() => onEdit())
    .catch((err) => {
      console.error(err);
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field, detail.message)
        );
      } else if (err.response &&
        err.response.status === 409 &&
        err.response.data?.error === "IllegalDefaultAdminAlterationError") {
          setEditError("You cannot alter the default admin user!");
      } else {
        setEditError("An unexpected error occurred, please retry!");
      }
    })
    .finally(() => {
      setEditLoading(false);
    });
  }, [api, userId]);

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>Edit User</Modal.Header>
      <Formik
        initialValues={{ displayName: "", password: "", passwordConfirmation: "", role: data?.role || "USER" }}
        validationSchema={schema}
        onSubmit={(values, { setFieldError }) => editUser(values, { setFieldError })}
      >
        {(props) => (
          <form
            className="space-y-4 overflow-y-auto grow"
            onSubmit={props.handleSubmit}
            noValidate
          >
            <div className="shrink-0 relative h-24 bg-amber-500 mb-6">
              <div className="absolute top-12 m-auto left-0 right-0 bg-gray-100 dark:bg-gray-800 rounded-full w-fit">
                <UserEditDialogAvatar username={data?.username} userId={userId} />
              </div>
            </div>
            <Modal.Body className="space-y-4 flex flex-col">
              <div className="w-full flex justify-center">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-800 w-32" />
                  </div>
                ) : error ? (
                  <div className="h-3 bg-red-200 dark:bg-red-400 rounded-full w-32" />
                ) : (
                  <h1 className="font-semibold max-w-[50%]">
                    {data?.username}
                  </h1>
                )}
              </div>
              {editError && (
                <p className="text-center text-red-500">{editError}</p>
              )}
              {error && (
                <p className="text-center text-red-500">{error}</p>
              )}
              <div className="flex flex-col space-y-6 text-gray-900 dark:text-white">
                {!importedUser && (
                  <div>
                    <TextInput
                      theme={customTextInputTheme}
                      name="displayName"
                      type="text"
                      placeholder={data?.displayName || "Display Name"}
                      disabled={loading}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.displayName}
                      color={props.errors.displayName && props.touched.displayName ? "failure" : "gray"}
                      helperText={props.errors.displayName && props.touched.displayName ? props.errors.displayName : null}
                    />
                  </div>
                )}
                {!importedUser && (
                  <div>
                    <TextInput
                      theme={customTextInputTheme}
                      name="password"
                      type="password"
                      placeholder="Password"
                      disabled={loading}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.password}
                      color={props.errors.password && props.touched.password ? "failure" : "gray"}
                      helperText={props.errors.password && props.touched.password ? props.errors.password : null}
                    />
                  </div>
                )}
                {!importedUser && (
                  <div>
                    <TextInput
                      theme={customTextInputTheme}
                      name="passwordConfirmation"
                      type="password"
                      placeholder="Confirm Password"
                      disabled={loading}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.passwordConfirmation}
                      color={props.errors.passwordConfirmation && props.touched.passwordConfirmation ? "failure" : "gray"}
                      helperText={props.errors.passwordConfirmation && props.touched.passwordConfirmation ? props.errors.passwordConfirmation : null}
                    />
                  </div>
                )}
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="user-add-roles" value="Select role" />
                  </div>
                  <Select
                    id="user-add-roles"
                    required
                    name="role"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.role}
                    color={props.errors.role && props.touched.role ? "failure" : "gray"}
                    helperText={props.errors.role && props.touched.role ? props.errors.role : null}
                  >
                    <option>ADMINISTRATOR</option>
                    <option>USER</option>
                  </Select>
                  <div className="text-xs mt-2">
                    <span className="text-amber-600">Attention: </span>
                    Depending on the role selected, the user is granted extensive rights for the entire platform.
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
                disabled={!(props.isValid && props.dirty) || loading || editLoading}
              >
                {!editLoading && <span>Edit User</span>}
                {editLoading && <Spinner size="sm" className="fill-white" />}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
