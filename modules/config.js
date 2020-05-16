/*******Connecting-Google-Sheet***********************/
const GoogleSpreadsheet = require('google-spreadsheet');

let connect = {
    doc: new GoogleSpreadsheet('**Paste your document id Here**'),
    creds: require('../client_secret.json')
}
module.exports = connect;
/*****************************************************/