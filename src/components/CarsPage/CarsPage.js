import React, { useRef, useState } from "react";
import CarCard from "./CarCard/CarCard";
import queries from "../../queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import Loader from "../../common/Loader/Loader";
import classes from "./CarPage.module.css";
import { useMutation } from "@apollo/client";
import ErrorAlert from "../../common/ErrorAlert/ErrorAlert";
import { Formik, Field } from "formik";
import Button from "@material-ui/core/Button";

const initialValues = {
  manufacturer: "All",
};

export default function CarsPage() {
  const formRef = useRef();
  let showLoader = false;
  const [openedCard, setOpenedCard] = useState("");
  const [removeCar, result] = useMutation(queries.REMOVE_CAR, {
    refetchQueries: [{ query: queries.GET_CARS }],
  });
  const { loading, data } = useQuery(queries.GET_CARS, {
    fetchPolicy: "network-only",
  });
  const manu = useQuery(queries.GET_MANUFACTURERS, {
    fetchPolicy: "network-only",
  });
  const [getCarsByManu, getCarsByManuResult] = useLazyQuery(
    queries.GET_MANUFACTURER,
    { fetchPolicy: "network-only" }
  );

  let queryCars = [];
  if (getCarsByManuResult.data) {
    const { manufacturer } = getCarsByManuResult.data;
    queryCars = manufacturer.cars.map((car) => {
      const newCar = { ...car };
      newCar.manufacturer = {
        name: manufacturer.name,
        id: manufacturer.id,
        headquarters: manufacturer.headquarters,
      };
      return newCar;
    });
  } else if (data) {
    queryCars = data.cars;
  }

  const onSubmitHandler = (values) => {
    setOpenedCard(false);
    getCarsByManu({ variables: { id: values.manufacturer } });
  };
  let cars = [];
  let manufacturerOptions = [];
  if (manu.data) {
    manufacturerOptions = manu.data.manufacturers.map((manu) => (
      <option key={manu.id} value={manu.id}>
        {manu.name}
      </option>
    ));
  }

  if (result.error) return <ErrorAlert />;
  if (
    loading ||
    manu.loading ||
    !data ||
    !manu.data ||
    getCarsByManuResult.loading
  ) {
    showLoader = true;
  } else {
    cars = queryCars.map((car) => (
      <CarCard
        key={car.id}
        car={car}
        onClickHandler={setOpenedCard}
        onDeleteHandler={removeCar}
        opened={car.id === openedCard}
        refetchAfterEdit={() =>
          getCarsByManu({
            variables: { id: formRef.current.values.manufacturer },
          })
        }
      />
    ));
  }

  return (
    <div className={classes.carPage}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmitHandler}
        innerRef={formRef}
      >
        {(props) => (
          <form className={classes.form} onSubmit={props.handleSubmit}>
            <span>
              <label htmlFor="manufacturer">Manufacturer</label>
              <Field name="manufacturer" component="select">
                <option value="All">All</option>
                {manufacturerOptions}
              </Field>
            </span>

            <Button type="submit" color="primary" variant="contained">
              Filter
            </Button>
          </form>
        )}
      </Formik>
      {showLoader ? <Loader /> : cars.reverse()}
    </div>
  );
}
