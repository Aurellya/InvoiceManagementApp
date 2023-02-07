import mongoose, { Schema, model, models } from "mongoose";
// import Users from "./Schema";
import Invoices from "./InvoiceSchema";
import Customers from "./CustomerSchema";
import PriceLists from "./PriceListSchema";

const groupSchema = new Schema({
  group_code: String,
  // members: [{ type: mongoose.Schema.Types.ObjectId, ref: Users }],
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: Invoices }],
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: Customers }],
  priceLists: [{ type: mongoose.Schema.Types.ObjectId, ref: PriceLists }],
});

const Groups = models.group || model("group", groupSchema);

export default Groups;
