const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  inputs: [
    {
      id: { type: Number, required: true },
      type: { type: String, required: true },
      label: { type: String,},
      placeholder: { type: String},
    },
  ],
});

const Form = mongoose.model("Form", formSchema);
module.exports = Form;
