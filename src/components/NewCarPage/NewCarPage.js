import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import classes from "./NewCarPage.module.css";
import Button from "@material-ui/core/Button";
import queries from "../../queries";
import { useMutation, useQuery } from "@apollo/client";
import Loader from "../../common/Loader/Loader";
import Alert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

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
  model: "",
  year: "",
  manufacturer: "",
  description: "",
};

const validate = (values) => {
  const errors = {};
  const year_regex = /^[0-9]+$/;
  if (!values.model) {
    errors.model = " - Required!";
  }
  if (!values.manufacturer) {
    errors.manufacturer = " - Required!";
  }
  if (!values.year) {
    errors.year = " - Required!";
  } else if (!year_regex.test(values.year)) {
    errors.year = " - Year must be a number!";
  }
  if (values.description.length > 150) {
    errors.description = "Max 150 characters!";
  }

  return errors;
};

export default function NewCarPage() {
  const history = useHistory();
  const { data, loading } = useQuery(queries.GET_MANUFACTURERS);
  const [addCar, result] = useMutation(queries.ADD_NEW_CAR);
  const onSubmitHandler = (values) => {
    values.year = +values.year;
    addCar({
      variables: values,
    });
  };
  if (loading || !data) {
    return <Loader />;
  } else if (result.data) {
    return successAlert(() => history.go(0));
  } else if (result.error) {
    return errorAlert(() => history.go(0));
  }
  const manufacturerOptions = data.manufacturers.map((manu) => (
    <option key={manu.id} value={manu.id}>
      {manu.name}
    </option>
  ));
  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmitHandler}
      isValid
    >
      {(props) => (
        <form className={classes.form} onSubmit={props.handleSubmit}>
          <label htmlFor="model">
            Model
            <span className={classes.error}>
              <ErrorMessage name="model" />
            </span>
          </label>
          <Field name="model" type="text" />

          <label htmlFor="year">
            Year
            <span className={classes.error}>
              <ErrorMessage name="year" />
            </span>
          </label>
          <Field name="year" type="year" />

          <label htmlFor="manufacturer">
            Manufacturer
            <span className={classes.error}>
              <ErrorMessage name="manufacturer" />
            </span>
          </label>
          <Field name="manufacturer" component="select">
            <option value="" hidden></option>
            {manufacturerOptions}
          </Field>
          
          <span className={classes.error}>
            <ErrorMessage name="description" />
          </span>
          <Field
            name="description"
            component="textarea"
            placeholder="Description (optional)"
          />
          
          <Button
            disabled={!props.isValid || !props.dirty || result.loading}
            type="submit"
            color="primary"
            variant="contained"
          >
            Add new car
          </Button>
        </form>
      )}
    </Formik>
  );
}
