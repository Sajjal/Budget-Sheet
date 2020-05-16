const get_date = require('./date.js');
const date = get_date.Date();

/*************Connecting-Google-Sheets*****************/
const connection = require('./config.js')
const { promisify } = require('util');

module.exports.addToDoc = async function(type, category, description, amount) {

    await promisify(connection.doc.useServiceAccountAuth)(connection.creds);
    const info = await promisify(connection.doc.getInfo)();

    let sheet;
    if (type === 'Expenses') { sheet = info.worksheets[0]; } else
    if (type === 'Income') { sheet = info.worksheets[1]; }

    /**********Adding-New-Record**************/
    const row = { date: date, category: category, description: description, amount: amount };
    await promisify(sheet.addRow)(row);

}