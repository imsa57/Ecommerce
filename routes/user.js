import Express from "express";
import { fetchUpdateUser, fetchUserById } from "../controller/user.js";

const userRouter = Express.Router();
userRouter.get("/", fetchUserById).patch("/", fetchUpdateUser);

export default userRouter; 
