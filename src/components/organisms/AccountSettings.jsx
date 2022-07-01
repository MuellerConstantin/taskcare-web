import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import AccountDeletionModal from "./AccountDeletionModal";
import { fetchPrincipal } from "../../api/auth";
import { updateUser } from "../../api/users";
import authSlice from "../../store/slices/auth";

const nameSchema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
});

const emailSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Is required"),
});

const passwordSchema = yup.object().shape({
  password: yup.string().required("Is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Is required"),
});

export default function AccountSettingsTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const principal = useSelector((state) => state.auth.principal);

  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState(null);

  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPaswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  const onUpdateName = async (values, { setFieldError, resetForm }) => {
    setNameLoading(true);
    setNameSuccess(false);
    setNameError(null);

    const update = {
      firstName: values.firstName === "" ? null : values.firstName,
      lastName: values.lastName === "" ? null : values.lastName,
    };

    try {
      await updateUser(principal.username, update);
      const principalRes = await fetchPrincipal(principal.username);

      dispatch(authSlice.actions.setPrincipal(principalRes.data));

      setNameSuccess(true);
      resetForm();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field.split(".").pop(), detail.message)
        );
      } else if (err.response && err.response.status === 401) {
        dispatch(authSlice.actions.logout());
        navigate("/login");
      } else {
        setNameError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setNameLoading(false);
    }
  };

  const onUpdateEmail = async (values, { setFieldError, resetForm }) => {
    setEmailLoading(true);
    setEmailSuccess(false);
    setEmailError(null);

    const update = {
      email: values.email,
    };

    try {
      await updateUser(principal.username, update);
      const principalRes = await fetchPrincipal(principal.username);

      dispatch(authSlice.actions.setPrincipal(principalRes.data));

      setEmailSuccess(true);
      resetForm();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field.split(".").pop(), detail.message)
        );
      } else if (err.response && err.response.status === 401) {
        dispatch(authSlice.actions.logout());
        navigate("/login");
      } else {
        setEmailError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setEmailLoading(false);
    }
  };

  const onUpdatePassword = async (values, { setFieldError, resetForm }) => {
    setPasswordLoading(true);
    setPaswordSuccess(false);
    setPasswordError(null);

    const update = {
      password: values.password,
    };

    try {
      await updateUser(principal.username, update);

      setPaswordSuccess(true);
      resetForm();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field.split(".").pop(), detail.message)
        );
      } else if (err.response && err.response.status === 401) {
        dispatch(authSlice.actions.logout());
        navigate("/login");
      } else {
        setPasswordError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl">Change Display Name</h2>
          <hr className="border-gray-300 dark:border-gray-400 mt-2" />
        </div>
        <p>
          This is the display name consisting of first name and last name which
          is used when viewing your profile. The display name is optional,
          alternatively the username is used. You can remove it at any time.
        </p>
        {nameError && <p className="text-left text-red-500">{nameError}</p>}
        {nameSuccess && (
          <p className="text-left text-green-500">Name changed successfully.</p>
        )}
        <div className="w-full">
          <Formik
            initialValues={{ firstName: "", lastName: "" }}
            onSubmit={onUpdateName}
            validationSchema={nameSchema}
          >
            {(props) => (
              <form
                className="flex flex-col w-full space-y-4"
                onSubmit={props.handleSubmit}
                noValidate
              >
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="grow">
                    <TextField
                      type="text"
                      name="firstName"
                      placeholder={principal.firstName || "First Name"}
                      value={props.values.firstName}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={props.errors.firstName}
                      touched={
                        props.errors.firstName && props.touched.firstName
                      }
                      disabled={nameLoading || passwordLoading || emailLoading}
                    />
                  </div>
                  <div className="grow">
                    <TextField
                      type="text"
                      name="lastName"
                      placeholder={principal.lastName || "Last Name"}
                      value={props.values.lastName}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={props.errors.lastName}
                      touched={props.errors.lastName && props.touched.lastName}
                      disabled={nameLoading || passwordLoading || emailLoading}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="max-w-fit bg-green-500 focus:outline-green-500"
                  disabled={
                    !props.isValid ||
                    nameLoading ||
                    passwordLoading ||
                    emailLoading
                  }
                >
                  {!nameLoading && <span>Change</span>}
                  {nameLoading && (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                  )}
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl">Change E-Mail</h2>
          <hr className="border-gray-300 dark:border-gray-400 mt-2" />
        </div>
        <p>
          Change the E-Mail address under which you want to be reachable and
          which is used to restore your account. This email address will not be
          visible to other users.
        </p>
        {emailError && <p className="text-left text-red-500">{emailError}</p>}
        {emailSuccess && (
          <p className="text-left text-green-500">
            E-Mail changed successfully.
          </p>
        )}
        <div className="w-full">
          <Formik
            initialValues={{ email: "" }}
            onSubmit={onUpdateEmail}
            validationSchema={emailSchema}
          >
            {(props) => (
              <form
                className="flex flex-col w-full space-y-4"
                onSubmit={props.handleSubmit}
                noValidate
              >
                <div className="grow">
                  <TextField
                    type="email"
                    name="email"
                    placeholder={principal.email}
                    value={props.values.email}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.errors.email}
                    touched={props.errors.email && props.touched.email}
                    disabled={nameLoading || passwordLoading || emailLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="max-w-fit bg-green-500 focus:outline-green-500"
                  disabled={
                    !(props.isValid && props.dirty) ||
                    nameLoading ||
                    passwordLoading ||
                    emailLoading
                  }
                >
                  {!emailLoading && <span>Change</span>}
                  {emailLoading && (
                    <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                  )}
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl">Change Password</h2>
          <hr className="border-gray-300 dark:border-gray-400 mt-2" />
        </div>
        <p>
          Change your account password. The new password will take effect the
          next time you log in.
        </p>
        {passwordError && (
          <p className="text-left text-red-500">{passwordError}</p>
        )}
        {passwordSuccess && (
          <p className="text-left text-green-500">
            Password changed successfully.
          </p>
        )}
        <div className="w-full">
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            onSubmit={onUpdatePassword}
            validationSchema={passwordSchema}
          >
            {(props) => (
              <form
                className="flex flex-col w-full space-y-4"
                onSubmit={props.handleSubmit}
                noValidate
              >
                <div>
                  <TextField
                    type="password"
                    name="password"
                    placeholder="New password"
                    value={props.values.password}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.errors.password}
                    touched={props.errors.password && props.touched.password}
                    disabled={nameLoading || passwordLoading || emailLoading}
                    className="grow"
                  />
                </div>
                <div>
                  <TextField
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={props.values.confirmPassword}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.errors.confirmPassword}
                    touched={
                      props.errors.confirmPassword &&
                      props.touched.confirmPassword
                    }
                    disabled={nameLoading || passwordLoading || emailLoading}
                    className="grow"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={
                    !(props.isValid && props.dirty) ||
                    nameLoading ||
                    passwordLoading ||
                    emailLoading
                  }
                  className="max-w-fit bg-green-500 focus:outline-green-500"
                >
                  Change
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className="text-gray-800 dark:text-white space-y-4">
        <div>
          <h2 className="text-2xl text-red-500">Delete your account</h2>
          <hr className="border-red-500 mt-2" />
        </div>
        <p>
          This will permanently delete your account. Attention all your chats
          will be deleted and the use of your username will be released for
          other users.
        </p>
        <div className="w-full">
          <AccountDeletionModal
            username={principal.username}
            onSuccess={() => {
              dispatch(authSlice.actions.clearAuthentication());
              navigate("/login");
            }}
          >
            <Button
              type="button"
              disabled={nameLoading || passwordLoading || emailLoading}
              className="bg-red-500 focus:outline-red-500"
            >
              Delete your account
            </Button>
          </AccountDeletionModal>
        </div>
      </div>
    </div>
  );
}