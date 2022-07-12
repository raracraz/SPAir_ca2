const dbconnect = require('./databaseConfig');

const Flight = {
    insert: function(flightcode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelDate, price, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into flights (flightCode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelTime, price) values (?, ?, ?, ?, ?, ?, ?, ?);"
                    conn.query(query, [flightcode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelDate, price], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            var flightid = (result.insertId).toString();
                            return callback(null, flightid);
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
                    var query = "SELECT * from flights;"
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

    getByOriginDestination: function(originAirport, destinationAirport, date, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT flights.flightid, flights.flightCode, flights.aircraft, airports.airport_name as originAirport, airports2.airport_name as destinationAirport, flights.embarkDate, flights.embarkTime, flights.travelTime, flights.price from flights join airports on flights.originAirport = airports.airportID join airports as airports2 on flights.destinationAirport = airports2.airportID where flights.originAirport = ? and flights.destinationAirport = ? and flights.embarkDate = ?;"
                    conn.query(query, [originAirport, destinationAirport, date], (err, result) => {
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

    getByFlightid: function(flightid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT flights.flightid, flights.flightCode, flights.aircraft, airports.airport_name as originAirport, airports2.airport_name as destinationAirport, flights.embarkDate, flights.embarkTime, flights.travelTime, flights.price from flights join airports on flights.originAirport = airports.airportID join airports as airports2 on flights.destinationAirport = airports2.airportID where flightid = ?;"
                    conn.query(query, [flightid], (err, result) => {
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

module.exports = Flight