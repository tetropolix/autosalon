const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
  manufacturer: { type: Schema.Types.ObjectId, ref: "manufacturer" },
  model: { type: String, required: [true, "Model name required!"] },
  year: { type: Number, required: [true, "Model year required!"] },
  description: String
});

module.exports = mongoose.model("car", carSchema);
