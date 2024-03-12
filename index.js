import Express from "express";
import mongoose from "mongoose";
import productRouter from "./routes/products.js";
import categoryRouter from "./routes/category.js";
import brandsRouter from "./routes/brands.js";
import cors from "cors";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";
import orderRouter from "./routes/order.js";
import passport from "passport";
import session from "express-session";
import path from "path";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
import crypto from "crypto";
import User from "./model/user.js";
import JWT from "jsonwebtoken";
import {
  cookieExtractor,
  isAuthenticated,
} from "./common/passportAuthorization.js";
import "dotenv/config.js";
import cookieParser from "cookie-parser";
import { requiredUserData } from "./common/passportAuthorization.js";
import Stripe from "stripe";
import order from "./model/order.js";
const stripe = new Stripe(process.env.STRIPE_KEY);

const server = Express();
server.post(
  "/webhook",
  Express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.END_POINT_KEY
      );
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    // console.log(`Unhandled event type ${event.type}`);
    // console.log(`Unhandled event type ${event.data.object}`);
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        const order = await order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = "received";
        await order.save();

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJWT.Strategy;

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// This is your Stripe CLI webhook secret for testing your endpoint locally.

// middleware
server.use(cookieParser());
server.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {
      secure: false, // Set to true if using HTTPS
    },
  })
);
server.use(passport.initialize());
server.use(passport.authenticate("session"));
server.use(passport.session());

const corsOptions = {
  origin: [
    "http://192.168.1.17:8080/",
    "http://localhost:3000",
    "http://192.168.0.4:3000",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  exposedHeaders: ["X-Total-Count"],
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  withCredentials: true,
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
server.use(Express.static(path.resolve("build")));

// Enable CORS with specific options
server.use(cors(corsOptions));
server.use(Express.json());
// server.use(Express.raw({ type: "application/json" }));
server.use("/products", productRouter);
server.use("/categories", categoryRouter);
server.use("/brands", brandsRouter);
server.use("/users", isAuthenticated(), userRouter);
server.use("/auth", authRouter);
server.use("/cart", isAuthenticated(), cartRouter);
server.use("/orders", isAuthenticated(), orderRouter);

// const passportFunction = () => {
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email }).exec();
      if (!user) {
        return done(null, false, { message: "user not found" });
      } else if (password) {
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, {
                message: "Invalid credential!",
              });
            } else {
              var token = JWT.sign(user.id, process.env.JWT_SECRET_KEY);
              return done(null, {
                token,
                ...requiredUserData(user),
                id: user.id,
              });
            }
          }
        );
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  "JWT",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ id: jwt_payload.id });
      if (user) {
        return done(null, { ...requiredUserData(user), id: user.id });
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
// };

//Payment

server.post("/create-payment-intent", async (req, res) => {
  const { totalPrice, orderId } = req.body;

  // const customer = await stripe.customers.create({
  //   email: "customer@example.com",
  // });

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.totalPrice * 100,
    currency: "inr",
    description: "Software development services",
    shipping: {
      name: "Jenny Rosen",
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
    },
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

const dataBaseConnection = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DataBase Connected");
};
dataBaseConnection().catch((errors) => console.log(errors));

server.get("*", (req, res) =>
  res.sendFile(path.resolve("build", "index.html"))
);
server.listen(process.env.PORT, () => {
  console.log("Server started");
});
//QahWETp1CC0ntJ5C
