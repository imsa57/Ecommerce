import mongoose from "mongoose";

const { Schema } = mongoose;
const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

/* 
 {
      "id": "2b17",
      "userID": "457b",
      "product": {
        "id": "1",
        "title": "iPhone 9",
        "description": "An apple mobile which is nothing like apple",
        "price": 508,
        "discountPercentage": 12.96,
        "rating": 4.69,
        "stock": 88,
        "brand": "Apple",
        "category": "smartphones",
        "thumbnail": "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
        "images": [
          "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
          "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
          "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
          "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"
        ],
        "delete": false
      },
      "quantity": 1
    },
*/

const virtual = cartSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
cartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("Cart", cartSchema);
