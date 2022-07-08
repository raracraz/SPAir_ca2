const dbconnect = require('./databaseConfig');

const Flight = {
    insert: function(flight, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into flights (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price) values (?, ?, ?, ?, ?, ?, ?);"
                    conn.query(query, [flight.flightCode, flight.aircraft, flight.originAirport, flight.destinationAirport, flight.embarkDate, flight.travelTime, flight.price], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err);
                        } else {
                            var flightid = (result.insertId).toString();
                            return callback(null, flightid);
                        }
                    })
                }
            }
        );
    },

    get_by_originID_destinationID: function(originAirportID, destinationAirportID, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT flights.flightid, flights.flightCode, flights.aircraft, airports.name as originAirport, airports2.name as destinationAirport, flights.embarkDate, flights.travelTime, flights.price from flights join airports on flights.originAirport = airports.airportID join airports as airports2 on flights.destinationAirport = airports2.airportID where flights.originAirport = ? and flights.destinationAirport = ?;"
                    conn.query(query, [originAirportID, destinationAirportID], (err, result) => {
                        conn.end()
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    })
                }
            }
        );
    },

    delete_by_id: function(flightid, callback) {
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
                            return callback(err);
                        } else {
                            return callback(null, result);
                        }
                    })
                }
            }
        );
    },
}

module.exports = Flight;