const express = require("express");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();

//cors = require("cors");
//app.use(cors());

//Import routes
const authRouter = require("./routes/authRouter");
const mainRouter = require("./routes/mainRouter");

//MiddleWares
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/", mainRouter);

let port = process.env.PORT || 3000;

app.get("*", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  return console.log(`Listening on localhost:${port}`);
});
