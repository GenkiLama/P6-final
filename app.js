require("dotenv").config();
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const app = express();

const connectDB = require("./db/connect");
const authRouter = require("./routes/authRouter");
const sauceRouter = require("./routes/sauceRouter");

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("cross-origin-resource-policy", "cross-origin");
  next();
});

// routes

app.use("/api/auth", authRouter);
app.use("/api/sauces", sauceRouter);
app.use("/images", express.static(path.join(__dirname, "images")));
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
