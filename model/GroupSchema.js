import mongoose, { Schema, model, models } from "mongoose";
import Invoices from "./InvoiceSchema";
import Customers from "./CustomerSchema";
import PriceLists from "./PriceListSchema";
import Users from "./Schema";

const groupSchema = new Schema({
  group_code: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: Users }],
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: Invoices }],
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: Customers }],
  priceLists: [{ type: mongoose.Schema.Types.ObjectId, ref: PriceLists }],
});

const Groups = models.group || model("group", groupSchema);

export default Groups;
