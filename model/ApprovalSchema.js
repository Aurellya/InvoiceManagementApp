import mongoose, { Schema, model, models } from "mongoose";
import Users from "./Schema";

const approvalSchema = new Schema({
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: Users },
  group_code: String,
  date: { type: Date, default: Date.now },
});

const approvals = models.approval || model("approval", approvalSchema);

export default approvals;
