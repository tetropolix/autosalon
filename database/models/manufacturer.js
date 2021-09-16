const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name for manufacturer is required!"],
  },
  headquarters: {
    type: String,
    required: [true, "Headquarters for manufacturer is required!"],
  },
  cars: [
    {
      type: Schema.Types.ObjectId,
      ref: "car",
    },
  ],
});

const Manufacturer = new mongoose.model("manufacturer", ManufacturerSchema);

module.exports = Manufacturer;
