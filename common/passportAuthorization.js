import passport from "passport";
import nodemailer from "nodemailer";
import "dotenv/config.js";

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "java95700@gmail.com",
    pass: process.env.MAIL_PASS,
  },
});
export const isAuthenticated = (req, res, next) => {
  return passport.authenticate("JWT");
};

export const requiredUserData = (user) => {
  return {
    role: user.role,
    addresses: user.addresses,
    name: user.name,
    email: user.email,
  };
};

export const cookieExtractor = function (req) {
  let token = null;
  if (req.token || req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

//Gmail

export const mailSentData = async ({ to, subject, html }) => {
  return await transporter.sendMail({
    from: '"Unique E-commerce 👻" <unique_E-commerce@gmail.com>',
    to,
    subject,
    text: "",
    html,
  });
};
