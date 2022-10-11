import { Formik } from "formik";
import * as yup from "yup";
import { SearchIcon } from "@heroicons/react/solid";
import TextField from "../../atoms/TextField";
import Button from "../../atoms/Button";

const schema = yup.object().shape({
  search: yup.string().required("Is required"),
});

export default function SearchBoardForm({ onSearch, disabled }) {
  return (
    <div className="w-full">
      <Formik
        initialValues={{ search: "" }}
        onSubmit={(values, { resetForm }) => {
          onSearch(values.search);
          resetForm();
        }}
        validationSchema={schema}
      >
        {(props) => (
          <form
            className="flex w-full"
            onSubmit={props.handleSubmit}
            noValidate
          >
            <TextField
              type="text"
              name="search"
              placeholder="Search for board"
              value={props.values.search}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              disabled={disabled}
              className="rounded-r-none grow focus:!outline-green-500"
            />
            <Button
              type="submit"
              disabled={disabled}
              className="border-l-0 rounded-l-none !bg-green-500 focus:!outline-green-500"
            >
              <SearchIcon className="h-6 w-6" aria-hidden="true" />
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
}
