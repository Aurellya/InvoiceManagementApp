import mongoose, { Schema, model, models } from "mongoose";

const invoiceItemSchema = new Schema({
  amount: Number,
  unit: String,
  item_name: String,
  price_per_item: Number,
  price_unit: String,
  total: Number,
});

const invoiceSchema = new Schema({
  customer_name: String,
  contents: [invoiceItemSchema],
  date: { type: Date, default: Date.now },
  status: String,
  total_items: Number,
  total: Number,
  notes: String,
});

const Invoices = models.invoice || model("invoice", invoiceSchema);

export default Invoices;
