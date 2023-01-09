import mongoose, { Schema, model, models } from "mongoose";

const priceListSchema = new Schema({
  product_name: String,
  amount: Number,
  unit: String,
  price: Number,
  remarks: String,
});

const priceLists = models.priceList || model("priceList", priceListSchema);

export default priceLists;
