const dbconnect = require('./databaseConfig');

const Airport = {
    insert: function(name, country, description, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into airports (airport_name, airport_country, airport_description) values (?, ?, ?);"
                    conn.query(query, [name, country, description], (err, result) => {
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
    getAll: function(callback) {
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
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    })
                }
            }
        );
    },
    getById: function(airportid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT * from airports where airportID = ?;"
                    conn.query(query, [airportid], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    })
                }
            }
        );
    },
    update: function(airportid, name, country, description, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "UPDATE airports SET airport_name = ?, airport_country = ?, airport_description = ? where airportID = ?;"
                    conn.query(query, [name, country, description, airportid], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    })
                }
            }
        );
    },
    deleteById: function(airportid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "DELETE from airports where airportID = ?;"
                    conn.query(query, [airportid], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    })
                }
            }
        );
    }
}

module.exports = Airport