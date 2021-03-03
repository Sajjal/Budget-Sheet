const express = require("express");
const router = express.Router();

const { verifyLogin } = require("../modules/verifyLogin");
const { addData, searchData, updateData } = require("../modules/dbConfig");

router.get("/", (req, res) => {
  return res.sendFile("index.html", { root: public });
});

router.post("/add", verifyLogin, async (req, res) => {
  try {
    if (req.body.type == "balance") await addData("balance", req.body.data);
    else await addData("incomeExpense", req.body.data);
    res.sendStatus(200);
  } catch (err) {
    return res.status(401).json({ Error: "ServerError: Unable to Add Record!" });
  }
});

router.post("/edit", verifyLogin, async (req, res) => {
  try {
    if (req.body.type == "balance") await updateData("balance", req.body.id, req.body.data);
    else await updateData("incomeExpense", req.body.id, req.body.data);
    res.sendStatus(200);
  } catch (err) {
    return res.status(401).json({ Error: "ServerError: Unable to Update!" });
  }
});

router.post("/search", verifyLogin, async (req, res) => {
  try {
    data = await searchData("incomeExpense", { date: { $gte: new Date(req.body.data.from).toISOString(), $lt: new Date(req.body.data.to).toISOString() } });
    balance = await searchData("balance");
    return res.status(200).json({ data, balance: balance[0] });
  } catch (err) {
    return res.status(404).json({ Error: "ServerError: Unable to Search Data!" });
  }
});

module.exports = router;
