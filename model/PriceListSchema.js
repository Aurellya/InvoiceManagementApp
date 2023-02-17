import mongoose, { Schema, model, models } from "mongoose";

const priceListSchema = new Schema({
  product_name: String,
  unit: String,
  price: Number,
  capital_cost: Number,
  remarks: String,
});

const priceLists = models.priceList || model("priceList", priceListSchema);

export default priceLists;
