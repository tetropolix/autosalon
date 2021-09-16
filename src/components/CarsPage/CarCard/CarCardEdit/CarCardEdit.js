import React, { useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { Button } from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../../../../queries";
import Loader from "../../../../common/Loader/Loader";
import classes from "./CarCardEdit.module.css";

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

  if (values.description && values.description.length > 150) {
    errors.description = "Max 150 characters!";
  }

  return errors;
};

export default function CarCardEdit(props) {
  const { model, year, manufacturer, description, id } = props.car;
  const { closeEdit } = props;
  const [updateCar, updateResult] = useMutation(queries.UPDATE_CAR, {
    refetchQueries: [{ query: queries.GET_CARS }],
  });
  //SUBMIT HANDLER
  const onSubmitHandler = (values) => {
    values.year = +values.year;
    const variables = { carId: id, ...values };
    updateCar({ variables: variables }).then((res) => {
      props.refetchAfterEdit();
    });
  };
  //INITIAL VALUES FOR FORM
  const initialValues = {
    model,
    year,
    manufacturer: manufacturer.id,
    description: description === null ? "" : description,
  };
  const { data, loading } = useQuery(queries.GET_MANUFACTURERS);
  useEffect(() => {
    return closeEdit;
  }, [closeEdit]);
  let manufacturerOptions = [];
  if (data) {
    manufacturerOptions = data.manufacturers.map((manu) => {
      if (manu.id !== manufacturer.id) {
        return (
          <option key={manu.id} value={manu.id}>
            {manu.name}
          </option>
        );
      } else {
        return null;
      }
    });
  }
  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmitHandler}
      isValid
    >
      {loading || !data ? (
        <Loader />
      ) : (
        (props) => (
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
              <option value={manufacturer.id}>{manufacturer.name}</option>
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
              disabled={!props.isValid || !props.dirty || updateResult.loading}
              type="submit"
              color="primary"
              variant="outlined"
            >
              Update car
            </Button>

            <Button
              onClick={() => closeEdit()}
              color="secondary"
              variant="outlined"
              className={classes.discardButton}
              disabled={updateResult.loading}
            >
              Discard update
            </Button>
          </form>
        )
      )}
    </Formik>
  );
}
