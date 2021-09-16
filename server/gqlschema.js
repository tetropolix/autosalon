const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
const _ = require("lodash");
const CarModel = require("../database/models/car");
const ManufacturerModel = require("../database/models/manufacturer");

const ManufacturerType = new GraphQLObjectType({
  name: "Manufacturer",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    headquarters: { type: new GraphQLNonNull(GraphQLString) },
    cars: { type: new GraphQLNonNull(GraphQLList(CarType)) },
  }),
});

const CarType = new GraphQLObjectType({
  name: "Car",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    manufacturer: { type: new GraphQLNonNull(ManufacturerType) },
    model: { type: new GraphQLNonNull(GraphQLString) },
    year: { type: new GraphQLNonNull(GraphQLInt) },
    description: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    manufacturer: {
      type: ManufacturerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return ManufacturerModel.findById(args.id).populate("cars");
      },
    },
    cars: {
      type: new GraphQLList(CarType),
      resolve() {
        const cars = CarModel.find({}).populate("manufacturer");
        return cars;
      },
    },
    manufacturers: {
      type: new GraphQLList(ManufacturerType),
      resolve() {
        return ManufacturerModel.find({});
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addCar: {
      type: CarType,
      args: {
        manufacturer: { type: new GraphQLNonNull(GraphQLID) },
        model: { type: new GraphQLNonNull(GraphQLString) },
        year: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        const { manufacturer, model, year, description } = args;
        const newCar = new CarModel({ manufacturer, model, year, description });
        return ManufacturerModel.findByIdAndUpdate(manufacturer, {
          $push: { cars: newCar.id },
        }).then(() => newCar.save());
      },
    },
    addManu: {
      type: ManufacturerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        headquarters: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const { name, headquarters } = args;
        const newManu = new ManufacturerModel({ name, headquarters });
        return newManu.save();
      },
    },
    removeCar: {
      type: CarType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return CarModel.findByIdAndRemove(args.id);
      },
    },
    updateCar: {
      type: CarType,
      args: {
        carId: { type: new GraphQLNonNull(GraphQLID) },
        manufacturer: { type: new GraphQLNonNull(GraphQLID) },
        model: { type: new GraphQLNonNull(GraphQLString) },
        year: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        const { manufacturer, model, year, description } = args;
        let manuIdToRemoveCar = null;
        return CarModel.findById(args.carId)
          .then((car) => {
            if (!car) return null;
            manuIdToRemoveCar = car.manufacturer;
            return Promise.all([
              CarModel.findByIdAndUpdate(
                args.carId,
                {
                  manufacturer,
                  model,
                  year,
                  description,
                },
                { new: true }
              ).populate("manufacturer"),
              ManufacturerModel.findByIdAndUpdate(manuIdToRemoveCar, {
                $pull: { cars: args.carId },
              }),
              ManufacturerModel.findByIdAndUpdate(manufacturer, {
                $push: { cars: args.carId },
              }),
            ]);
          })
          .then((values) => {
            return values[0];
          });
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
