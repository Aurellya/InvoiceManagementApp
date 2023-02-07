import mongoose, { Schema, model, models } from "mongoose";
import Groups from "./GroupSchema";

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: Groups },
});

const Users = models.user || model("user", userSchema);

export default Users;
