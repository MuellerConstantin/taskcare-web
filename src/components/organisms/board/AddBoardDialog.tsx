import React, { useState, useCallback } from "react";
import { chain } from "react-aria";
import { DialogProps, Heading } from "react-aria-components";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { Form } from "@/components/atoms/Form";
import { TextField } from "@/components/atoms/TextField";
import { TextArea } from "@/components/atoms/TextArea";
import { Button } from "@/components/atoms/Button";
import { Dialog } from "@/components/atoms/Dialog";
import { Spinner } from "@/components/atoms/Spinner";
import useApi from "@/hooks/useApi";

interface AddBoardDialogProps extends Omit<DialogProps, "children"> {
  onAdd?: () => void;
}

const schema = yup.object().shape({
  name: yup.string().required("Is required"),
  description: yup.string().max(1024, "May not exceed 1024 characters"),
});

export function AddBoardDialog({ onAdd, ...props }: AddBoardDialogProps) {
  const api = useApi();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBoard = useCallback(
    (
      { name, description }: { name: string; description: string },
      { setFieldError }: FormikHelpers<{ name: string; description: string }>,
      close: () => void,
    ) => {
      setIsLoading(true);
      setError(null);

      api
        .post("/boards", {
          name,
          description:
            description && description.length > 0 ? description : null,
        })
        .then(chain(() => onAdd?.(), close))
        .catch((err) => {
          if (err.response && err.response.status === 422) {
            err.response.data.details?.forEach(
              (detail: { field: string; message: string }) =>
                setFieldError(detail.field, detail.message),
            );
          } else {
            setError("An unexpected error occurred, please retry!");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [api, onAdd],
  );

  return (
    <Dialog {...props}>
      {({ close }) => (
        <>
          <Heading
            slot="title"
            className="my-0 text-xl leading-6 font-semibold"
          >
            Add Board
          </Heading>
          <div className="mt-4">
            <Formik
              initialValues={{ name: "", description: "" }}
              validationSchema={schema}
              onSubmit={(values, actions) => addBoard(values, actions, close)}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit} validationBehavior="aria">
                  {error && <p className="text-center text-red-500">{error}</p>}
                  <TextField
                    placeholder="Name"
                    name="name"
                    type="text"
                    isDisabled={isLoading}
                    value={props.values.name}
                    onBlur={props.handleBlur}
                    onChange={(value) => props.setFieldValue("name", value)}
                    isInvalid={!!props.touched.name && !!props.errors.name}
                    errorMessage={props.errors.name}
                  />
                  <TextArea
                    placeholder="Description"
                    name="description"
                    isDisabled={isLoading}
                    value={props.values.description}
                    onBlur={props.handleBlur}
                    rows={6}
                    onChange={(value) =>
                      props.setFieldValue("description", value)
                    }
                    isInvalid={
                      !!props.touched.description && !!props.errors.description
                    }
                    errorMessage={props.errors.description}
                  />
                  <div className="mt-6 flex justify-end gap-2">
                    <Button variant="secondary" onPress={close}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={!(props.isValid && props.dirty) || isLoading}
                      className="flex justify-center"
                      variant="primary"
                      autoFocus
                    >
                      {!isLoading && <span>Add Board</span>}
                      {isLoading && <Spinner />}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}
    </Dialog>
  );
}
