import Express from "express";
import {
  createMultipleProducts,
  createProduct,
  fetchFilterproduct,
  fetchProductById,
  fetchUpdateProduct,
} from "../controller/products.js";

const productRouter = Express.Router();
productRouter
  .post("/", createProduct)
  .get("/", fetchFilterproduct)
  .get("/:id", fetchProductById)
  .patch("/:id", fetchUpdateProduct)
  .post("/multiple", createMultipleProducts);

export default productRouter;
