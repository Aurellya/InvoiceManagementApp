import mongoose, { Schema, model, models } from "mongoose";

const customerSchema = new Schema({
  name: String,
  phone_no: String,
  address: String,
  email: String,
  remarks: String,
});

const Customers = models.customer || model("customer", customerSchema);

export default Customers;
