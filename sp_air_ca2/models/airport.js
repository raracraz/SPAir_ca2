const dbconnect = require('./databaseConfig');

const Airport = {
    insert: function(airport, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into airports (name, country, description) values (?, ?, ?);"
                    conn.query(query, [airport.name, airport.country, airport.description], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            var airportid = (result.insertId).toString();
                            return callback(null, airportid);
                        }
                    })
                }
            }
        );
    },

    get_all: function(callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT * from airports;"
                    conn.query(query, (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err);
                        } else {
                            return callback(null, result);
                        }
                    })
                }
            }
        );
    }
}

module.exports = Airport;