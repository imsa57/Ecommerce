import Express from "express";
import { createCategories, fetchAllCategory } from "../controller/category.js";

const categoryRouter = Express.Router();
categoryRouter.get("/", fetchAllCategory).post("/", createCategories);

export default categoryRouter;
