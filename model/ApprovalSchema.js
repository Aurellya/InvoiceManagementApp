import mongoose, { Schema, model, models } from "mongoose";
import Users from "./Schema";
import Groups from "./GroupSchema";

const approvalSchema = new Schema({
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: Users },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: Groups },
  date: { type: Date, default: Date.now },
});

const approvals = models.approval || model("approval", approvalSchema);

export default approvals;
