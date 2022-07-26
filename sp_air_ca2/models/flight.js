const dbconnect = require('./databaseConfig');

const Flight = {
    insert: function(flightcode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelDate, price, flightseat_pic_url, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into flights (flightCode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelTime, price, flightseat_pic_url) values (?, ?, ?, ?, ?, ?, ?, ?);"
                    conn.query(query, [flightcode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelDate, price, flightseat_pic_url], (err, result) => {
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
                    var query = "SELECT flights.flightid, flights.flightCode, flights.aircraft, airports.airport_name as originAirport, airports2.airport_name as destinationAirport, airports.airport_country as originCountry, airports2.airport_country as destinationCountry, flights.embarkDate, flights.embarkTime, flights.travelTime, flights.price, flights.flightseat_pic_url from flights join airports on flights.originAirport = airports.airportID join airports as airports2 on flights.destinationAirport = airports2.airportID;"
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
                    var query = "SELECT flights.flightid, flights.flightCode, flights.aircraft, airports.airport_name as originAirport, airports2.airport_name as destinationAirport, flights.embarkDate, flights.embarkTime, flights.travelTime, flights.price, flights.flightseat_pic_url from flights join airports on flights.originAirport = airports.airportID join airports as airports2 on flights.destinationAirport = airports2.airportID where flights.originAirport = ? and flights.destinationAirport = ? and flights.embarkDate = ?;"
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
                    var query = "SELECT flights.flightid, flights.flightCode, flights.aircraft, airports.airport_name as originAirport, airports2.airport_name as destinationAirport, airports.airport_country as originCountry, airports2.airport_country as destinationCountry, flights.embarkDate, flights.embarkTime, flights.travelTime, flights.price, flights.flightseat_pic_url from flights join airports on flights.originAirport = airports.airportID join airports as airports2 on flights.destinationAirport = airports2.airportID where flightid = ?;"
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
    },
    update: function(flightid, flightcode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelDate, price, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "UPDATE flights SET flightCode = ?, aircraft = ?, originAirport = ?, destinationAirport = ?, embarkDate = ?, embarkTime = ?, travelTime = ?, price = ? WHERE flightid = ?;"
                    conn.query(query, [flightcode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelDate, price, flightid], (err, result) => {
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
    delete: function(flightid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "DELETE from flights where flightid = ?;"
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
    },
    updateFlightseatpic: function(flightid, seatpic, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "UPDATE flights SET flightseat_pic_url = ? WHERE flightid = ?;"
                    conn.query(query, [seatpic, flightid], (err, result) => {
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