import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: Buffer, required: true },
  role: { type: String, required: true, default: "user" },
  addresses: { type: [Schema.Types.Mixed], default: [] },
  salt: { type: Buffer },
});

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("User", userSchema);
