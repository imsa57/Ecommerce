import {
  mailSentData,
  requiredUserData,
} from "../common/passportAuthorization.js";
import User from "../model/user.js";
import crypto from "crypto";
import JWT from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const isExit = await User.findOne({ email: req.body.email }).exec();
    if (isExit) {
      return res.status(400).json({ message: "User already exist!" });
    }
    let salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const newUser = await user.save();
        req.login(newUser, function (err) {
          if (err) {
            return next(err);
          }
          var token = JWT.sign(user.id, process.env.JWT_SECRET_KEY);
          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
          });
          res.status(201).json(requiredUserData(newUser));
        });
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};

export const login = async (req, res) => {
  res.cookie("jwt", req.user.token, {
    expires: new Date(Date.now() + 3600000),
    httpOnly: true,
  });
  res.status(200).json({ ...requiredUserData(req.user) });
};

export const checkAuth = async (req, res) => {
  if (req.user) {
    res.status(200).json(requiredUserData(req.user));
  } else {
    res.sendStatus(401);
  }
};

export const logout = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res
      .cookie("jwt", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .status(200)
      .json(null);
      
  });
};

export const resetPasswordSession = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();

    const resetPageLink =
      "http://localhost:8080/forgotPassword?token=" +
      token +
      "&email=" +
      req.body.email;
    const subject = "reset password for e-commerce";
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;
    try {
      const response = await mailSentData({
        to: req.body.email,
        subject,
        html,
      });
      res.sendStatus(200);
    } catch (error) {
      res.status(400).json("Somthing went wrong");
    }
  } else {
    res.status(400).json("wrong Email");
  }
};

export const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  try {
    const user = await User.findOne({ email: email }).exec();
    if (user.resetPasswordToken === token) {
      let salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          user.password = hashedPassword;
          user.resetPasswordToken = "";
          await user.save();
          res.status(200).json("Password Changed!");
        }
      );
    } else {
      res.status(404).json("wrong credential");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
