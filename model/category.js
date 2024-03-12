import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  // "value": "smartphones",
  // "label": "smartphones",
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true, unique: true },
});

const virtual = categorySchema.virtual("id");
virtual.get(function () {
  return this._id;
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const  Categories = mongoose.model("Category", categorySchema);
