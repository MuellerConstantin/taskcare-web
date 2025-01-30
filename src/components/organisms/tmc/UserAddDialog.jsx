import { useState, useCallback } from "react";
import { Button, Spinner, TextInput, Modal, Label, Select } from "flowbite-react";
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

const schema = yup.object().shape({
  username: yup.string().required("Is required"),
  displayName: yup.string(),
  password: yup.string().required("Is required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Is required"),
  role: yup.string().required("Is required").oneOf(["ADMINISTRATOR", "USER"]),
});

export default function UserAddDialog({show, onAdd, onClose}) {
  const api = useApi();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addUser = useCallback(async ({ username, displayName, password, role }, {setFieldError}) => {
    setLoading(true);
    setError(null);

    api.post("/users", {
      username,
      password,
      displayName: displayName && displayName.length > 0 ? displayName : null,
      role
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
  }, [api]);

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>Add User</Modal.Header>
      <Formik
        initialValues={{ username: "", displayName: "", password: "", passwordConfirmation: "", role: "USER" }}
        validationSchema={schema}
        onSubmit={(values, { setFieldError }) => addUser(values, { setFieldError })}
      >
        {(props) => (
          <form
            className="space-y-4"
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
                    name="username"
                    type="text"
                    placeholder="Username"
                    disabled={loading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.username}
                    color={props.errors.username && props.touched.username ? "failure" : "gray"}
                    helperText={props.errors.username && props.touched.username ? props.errors.username : null}
                  />
                </div>
                <div>
                  <TextInput
                    theme={customTextInputTheme}
                    name="displayName"
                    type="text"
                    placeholder="Display Name"
                    disabled={loading}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.displayName}
                    color={props.errors.displayName && props.touched.displayName ? "failure" : "gray"}
                    helperText={props.errors.displayName && props.touched.displayName ? props.errors.displayName : null}
                  />
                </div>
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
                disabled={!(props.isValid && props.dirty) || loading}
              >
                {!loading && <span>Add User</span>}
                {loading && <Spinner size="sm" className="fill-white" />}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
