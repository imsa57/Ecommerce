import Express from "express";
import {
  createOrder,
  fetchFilterOrder,
  fetchOrderByUser,
  fetchUpdateOrder
} from "../controller/order.js";

const orderRouter = Express.Router();
orderRouter
  .post("/", createOrder)
  .get("/", fetchOrderByUser)
  .get("/all", fetchFilterOrder)
  .patch("/:id", fetchUpdateOrder);

export default orderRouter;
