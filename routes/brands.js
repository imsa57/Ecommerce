import Express from "express";
import { createBrand, fetchAllBrand } from "../controller/brands.js";

const brandsRouter = Express.Router();
brandsRouter.get("/", fetchAllBrand).post("/", createBrand);

export default brandsRouter;
