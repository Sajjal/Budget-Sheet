/****************Setting-Up-Environment***************** */
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs") + app.engine("ejs", require("ejs").__express);
app.use(express.static("views"));

//routing
let port = process.env.PORT || 3641;
const display = require("../routes/display");
const searchData = require("../routes/search");

app.use("/", display);
app.use("/", searchData);

/****************************************************** */

const processData = require("./addRecord");
const { verifyLogin } = require("./verifyLogin");

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // start blocking after 3 requests
  message: {
    status: 429,
    Error: "429: Access Denied",
  },
});

module.exports = {
  renderHTML: async function () {
    app.get("/dashboard", verifyLogin, function (req, res) {
      res.render("index.ejs", { message: "Add Records" });
    });

    app.get("/login", function (req, res) {
      res.render("login.ejs", { message: "Enter Access Code" });
    });

    app.get("/logout", function (req, res) {
      res.cookie("accessToken", "", { maxAge: 1 }).redirect("/login");
    });

    app.get("*", function (req, res) {
      res.redirect("/login");
    });

    app.post("/login", createAccountLimiter, async (req, res) => {
      //const response = await axios.post(`${process.env.ACCESS_URL}`, { service: "budgetsheet", uuid: req.body.accessCode });
      //if (!response.data.status) return res.render("login.ejs", { message: "Invalid Access Code" });

      if (req.body.accessCode != process.env.ACCESS_CODE) return res.render("login.ejs", { message: "Invalid Access Code" });
      const accessToken = jwt.sign({ id: "mrsajjal" }, process.env.TOKEN_SECRET, { expiresIn: "960s" }); //16 Minutes
      //Save accessToken to Client's Browser Cookie and Redirect to Dashboard
      res.cookie("accessToken", accessToken).redirect("/dashboard");
      //res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" }).redirect('/dashboard');;
    });

    app.post("/", verifyLogin, function (req, res) {
      /********First-Letter-Capital**********/
      const capitalize = (s) => {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
      };
      /**************************************/

      if (req.body.category_inc === "Select a Category...(*Required)") {
        category = req.body.category_exp;
      } else if (req.body.category_exp === "Select a Category...(*Required)") {
        category = req.body.category_inc;
      }

      type = req.body.type;
      category = capitalize(category);
      description = capitalize(req.body.description);
      amount = req.body.amount;

      processData.addToDoc(type, category, description, amount);

      res.render("index.ejs", { message: `Data Received!` });
    });

    app.listen(port, function () {
      return console.log(`Listening on localhost:${port}`);
    });
  },
};
