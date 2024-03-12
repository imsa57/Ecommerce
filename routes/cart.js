import Express from "express";

import {
  addToCart,
  fetchCartByUser,
  fetchUpdateCart,
  fetchDeleteItem,
} from "../controller/cart.js";

const cartRouter = Express.Router();
cartRouter
  .get("/", fetchCartByUser)
  .post("/", addToCart)
  .patch("/", fetchUpdateCart)
  .delete("/", fetchDeleteItem);

export default cartRouter;
