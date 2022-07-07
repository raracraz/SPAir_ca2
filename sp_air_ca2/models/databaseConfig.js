var mysql = require('mysql');

var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root', //your own password
        database: 'sp_air',
        dateStrings: true
    });
    return conn;
    }
};
// put this at the end of the file
module.exports = dbconnect;
