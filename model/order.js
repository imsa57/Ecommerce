import mongoose from "mongoose";

const { Schema } = mongoose;
const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [Schema.Types.Mixed], required: true },
  address: { type: Schema.Types.Mixed, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true },
  payment: { type: String, required: true, default: "pending" },
  orderCreatedAt: { type: Date, default: Date.now },
});

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("Order", orderSchema);
