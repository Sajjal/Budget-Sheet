/****************Setting-Up-Environment***************** */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs') +
    app.engine('ejs', require('ejs').__express);
app.use(express.static("views"));

//routing
let port = process.env.PORT || 3641;
const display = require('../routes/display');
const searchData = require('../routes/search');

app.use('/', display);
app.use('/', searchData);

/****************************************************** */

const processData = require('./addRecord');

module.exports = {
    renderHTML: async function() {

        app.get('*', function(req, res) {
            res.render('index.ejs', { message: 'Add Records' })
        });

        app.post("/", function(req, res) {

            /********First-Letter-Capital**********/
            const capitalize = (s) => {
                    if (typeof s !== 'string') return ''
                    return s.charAt(0).toUpperCase() + s.slice(1)
                }
                /**************************************/

            if (req.body.category_inc === 'Select a Category...(*Required)') {
                category = req.body.category_exp;
            } else if (req.body.category_exp === 'Select a Category...(*Required)') {
                category = req.body.category_inc;
            }

            type = req.body.type;
            category = capitalize(category);
            description = capitalize(req.body.description);
            amount = req.body.amount;

            processData.addToDoc(type, category, description, amount);

            res.render('index.ejs', { message: `Data Received!` })
        });

        app.listen(port, function() {
            return console.log(`Listening on localhost:${port}`);
        })
    }
}