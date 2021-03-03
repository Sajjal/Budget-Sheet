const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const { createAccountLimiter, verifyLogin } = require("../modules/verifyLogin");

router.post("/authorize", verifyLogin, (req, res) => {
  return res.sendStatus(200);
});

router.post("/login", createAccountLimiter, async (req, res) => {
  const response = await axios.post(`${process.env.ACCESS_URL}`, { service: "budgetsheet", uuid: req.body.accessCode });
  if (!response.data.status) return res.status(401).json({ Error: "Invalid Access Code" });
  //if (req.body.accessCode != process.env.ACCESS_CODE) return res.status(401).json({ Error: "Invalid Access Code" });

  const accessToken = jwt.sign({ id: "mrsajjal" }, process.env.TOKEN_SECRET, { expiresIn: "36000s" }); //Ten Hours
  //Save accessToken to Client's Browser Cookie and Redirect to Dashboard
  //return res.cookie("accessToken", accessToken).status(200).json({ Message: "You are Logged In !" });
  return res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" }).status(200).json({ Message: "You are Logged In !" });
});

router.post("/logout", (req, res) => {
  return res.cookie("accessToken", "", { maxAge: 1 }).json({ Error: "You are Logged out !" });
});

module.exports = router;
