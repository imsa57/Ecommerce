import Express from "express";
import {
  checkAuth,
  createUser,
  login,
  logout,
  resetPassword,
  resetPasswordSession,
} from "../controller/auth.js";
import passport from "passport";
import { isAuthenticated } from "../common/passportAuthorization.js";

const authRouter = Express.Router();
authRouter
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), login)
  .get("/check", isAuthenticated(), checkAuth) 
  .get("/logout", logout)
  .post("/reset-password-session", resetPasswordSession)
  .post("/reset-password", resetPassword);
export default authRouter;
