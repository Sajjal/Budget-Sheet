const display = require("../modules/retriveData");
const express = require("express");
let router = express.Router();

const { verifyLogin } = require("../modules/verifyLogin");

router.use(function (req, res, next) {
  next();
});

function convertDate(date) {
  let dateArray = date.split("-");
  day = dateArray[2];
  month = dateArray[1];
  year = dateArray[0];
  return month + "." + day + year;
}

async function searchRecords() {
  router
    .get("/search", verifyLogin, async function (req, res) {
      res.setHeader("Content-Type", "text/html");
      res.render("search.ejs", { message: "Explore Records!" });
      res.end();
    })

    .post("/search", verifyLogin, async function (req, res) {
      let searchTo = "category";
      let searchFor;
      let category;
      let type = req.body.type;
      let from = req.body.from;
      let to = req.body.to;

      if (req.body.category_inc === "Select a Category...(Optional)") {
        category = req.body.category_exp;
      } else if (req.body.category_exp === "Select a Category...(Optional)") {
        category = req.body.category_inc;
      }

      if (category === "Select a Category...(Optional)") {
        category = null;
      }

      if (from === "" || to === "") {
        from = null;
        to = null;
      } else {
        from = convertDate(from);
        to = convertDate(to);
      }

      searchFor = category;

      if (searchFor === null) {
        searchTo = null;
      }

      let records = await display.display(type, from, to, searchTo, searchFor);
      res.setHeader("Content-Type", "text/html");
      if (searchFor === null) {
        if (type === "Income") {
          res.render("display.ejs", { data: { message: `Income Records!`, records: records } });
        } else {
          res.render("display.ejs", { data: { message: `Expense Records!`, records: records } });
        }
      } else {
        res.render("display.ejs", { data: { message: `${searchFor} Records!`, records: records } });
      }
      res.end();
    });
}
searchRecords();
module.exports = router;
