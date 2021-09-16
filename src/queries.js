import { gql } from "@apollo/client";

const GET_CARS = gql`
  {
    cars {
      id
      model
      year
      description
      manufacturer {
        name
        headquarters
        id
      }
    }
  }
`;

const GET_MANUFACTURERS = gql`
  {
    manufacturers {
      id
      name
    }
  }
`;

const GET_MANUFACTURER = gql`
  query Manufacturer($id: ID!) {
    manufacturer(id: $id) {
      id
      name
      headquarters
      cars {
        id
        model
        year
        description
      }
    }
  }
`;

const ADD_NEW_CAR = gql`
  mutation AddCar(
    $model: String!
    $manufacturer: ID!
    $year: Int!
    $description: String
  ) {
    addCar(
      manufacturer: $manufacturer
      model: $model
      year: $year
      description: $description
    ) {
      model
    }
  }
`;

const ADD_NEW_MANUFACTURER = gql`
  mutation AddManu($name: String!, $headquarters: String!) {
    addManu(name: $name, headquarters: $headquarters) {
      id
    }
  }
`;

const UPDATE_CAR = gql`
  mutation UpdateCar(
    $carId: ID!
    $model: String!
    $manufacturer: ID!
    $year: Int!
    $description: String
  ) {
    updateCar(
      carId: $carId
      manufacturer: $manufacturer
      model: $model
      year: $year
      description: $description
    ) {
      model
      year
      description
      manufacturer {
        id
        name
      }
    }
  }
`;

const REMOVE_CAR = gql`
  mutation RemoveCar($id: ID!) {
    removeCar(id: $id) {
      model
    }
  }
`;

const queries = {
  GET_CARS,
  ADD_NEW_CAR,
  GET_MANUFACTURERS,
  GET_MANUFACTURER,
  REMOVE_CAR,
  UPDATE_CAR,
  ADD_NEW_MANUFACTURER,
};

export default queries;
