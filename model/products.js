import mongoose from "mongoose";

const { Schema } = mongoose;
const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, min: [0, "wrong min discount"], required: true },
  discountPercentage: {
    type: Number,
    min: [1, "wrong min discount"],
    max: [99, "wrong max discount"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min discount"],
    max: [5, "wrong max discount"],
    required: true,
    default: 0,
  },
  stock: {
    type: Number,
    min: [0, "wrong min discount"],
    required: true,
  },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
});

const virtual = ProductSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
// ProductSchema.index({
//   title: "text",
//   description: "text",
//   category: "text",
//   brand: "text",
// });

export const Product = mongoose.model("Product", ProductSchema);
