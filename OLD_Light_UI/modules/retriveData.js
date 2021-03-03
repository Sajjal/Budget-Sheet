const connection = require("./config.js");
const { promisify } = require("util");
const get_date = require("../modules/date");
const defaultDate = get_date.advanceDate();

module.exports.display = async function (type, dateFrom, dateTo, searchTo, searchFor) {
  await promisify(connection.doc.useServiceAccountAuth)(connection.creds);
  const info = await promisify(connection.doc.getInfo)();

  let sheet;
  if (type === "Expenses") {
    sheet = info.worksheets[0];
  } else if (type === "Income") {
    sheet = info.worksheets[1];
  }

  //to get the records from google sheet based on search or default

  let search;

  //default records
  if ((searchTo === null || searchFor === null) && (dateTo === null || dateFrom === null)) {
    search = `date>=${defaultDate.startDay} and date<=${defaultDate.endDay}`;
  }
  //search for specific type
  else if ((searchTo !== null || searchFor !== null) && (dateTo === null || dateFrom === null)) {
    search = `${searchTo}=${searchFor}`;
  }

  //search for specific date
  else if ((searchTo === null || searchFor === null) && (dateTo !== null || dateFrom !== null)) {
    search = `date>=${dateFrom} and date<=${dateTo}`;
  }

  //search for specific date and specific type
  else {
    search = `date>=${dateFrom} and date<=${dateTo} and ${searchTo}=${searchFor}`;
  }

  const rows = await promisify(sheet.getRows)({
    offset: 1,
    query: search,
  });

  //to put the records into array of objects
  let records = [];
  let sum = 0;
  rows.forEach(function (data) {
    record = {
      date: data.date.replace(/.{4}$/, ".$&"),
      category: data.category,
      description: data.description,
      amount: data.amount,
    };
    sum = sum + parseFloat(data.amount.replace("$", ""));
    records.push(record);
  });

  //to get the total of amount
  let totalobj = {};
  totalobj["total"] = "Total: ";
  totalobj["sum"] = "$" + sum.toFixed(2);
  records.push(totalobj);

  return records;
};
