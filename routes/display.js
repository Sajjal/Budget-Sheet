const display = require("../modules/retriveData");
const  express  =  require('express');
let router = express.Router();

router.use(function(req, res, next) {
    next();
})

async function display_records() {

    router
        .get('/income',  async function(req,  res)  {  
            let records = await display.display("Income", null, null, null, null); 
            res.setHeader('Content-Type', 'text/html');      
            res.render('display.ejs', { data: { message: 'Income Records of This Month!', records: records } });                                    
            res.end();        
        });

    router
        .get('/expenses',  async function(req,  res)  {  
            let records = await display.display("Expenses", null, null, null, null); 
            res.setHeader('Content-Type', 'text/html');        
            res.render('display.ejs', { data: { message: 'Expense Records of This Month!', records: records } });                                    
            res.end();        
        });
}
display_records();
module.exports = router;