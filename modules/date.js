module.exports.Date =
    function() {
        let date_ob = new Date();
        let day = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();

        let date = month + "." + day + +year;
        return date;
    }

module.exports.advanceDate =
    function() {
        let date_ob = new Date();
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let firstday = 01;
        let lastday = 31;

        let startDay = month + "." + '0' + firstday + +year;
        let endDay = month + "." + lastday + +year;

        let newdate = {
            startDay: startDay,
            endDay: endDay
        }
        return newdate;
    }