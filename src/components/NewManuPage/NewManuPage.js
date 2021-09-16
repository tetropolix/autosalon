import React, { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import classes from "./NewManuPage.module.css";
import Button from "@material-ui/core/Button";
import { useMutation } from "@apollo/client";
import queries from "../../queries";
import Alert from "@material-ui/lab/Alert";

const successAlert = (fn) => (
  <div className={classes.alert}>
    <Alert severity="success">New car succesfully added!</Alert>
    <Button variant="contained" color="primary" onClick={fn}>
      Add another
    </Button>
  </div>
);

const errorAlert = (fn) => (
  <div className={classes.alert}>
    <Alert severity="error">Error has occured, try again later!</Alert>
    <Button variant="contained" color="secondary" onClick={fn}>
      Try again
    </Button>
  </div>
);

const initialValues = {
  name: "",
  headquarters: "",
};

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = " - Required!";
  }
  if (!values.headquarters) {
    errors.headquarters = " - Required!";
  }
  return errors;
};

export default function NewManuPage() {
  const [alert, showAlert] = useState(null);
  const [addNewManu, result] = useMutation(queries.ADD_NEW_MANUFACTURER);
  const onSubmitHandler = (values) => {
    addNewManu({ variables: values })
      .then(() => showAlert("success"))
      .catch(() => showAlert("error"));
  };
  if (alert === "success") {
    return successAlert(() => showAlert(null));
  } else if (alert === "error") {
    return errorAlert(() => showAlert(null));
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmitHandler}
      isValid
    >
      {(props) => (
        <form className={classes.form} onSubmit={props.handleSubmit}>
          <label htmlFor="name">
            Manufacturer
            <span className={classes.error}>
              <ErrorMessage name="name" />
            </span>
          </label>
          <Field name="name" type="text" />

          <label htmlFor="headquarters">
            Headquarters
            <span className={classes.error}>
              <ErrorMessage name="headquarters" />
            </span>
          </label>
          <Field name="headquarters" type="text" />

          <Button
            disabled={!props.isValid || !props.dirty || result.loading}
            type="submit"
            color="primary"
            variant="contained"
          >
            Add new manufacturer
          </Button>
        </form>
      )}
    </Formik>
  );
}
