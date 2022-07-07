const dbconnect = require('./databaseConfig');

const Transfer = {
    insert: function (originAirportId, destinationAirportId, transfer, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into transfers (bookingid, firstFlightId, secondFlightId, originAirportId, transferAirportId, destinationAirportId) values (?, ?, ?, ?, ?, ?);"
                    conn.query(query, [transfer.bookingid, transfer.firstFlightId, transfer.secondFlightId, originAirportId, transfer.transferAirportId, destinationAirportId], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            var transferid = (result.insertId).toString();
                            return callback(null, transferid);
                        }
                    })
                }
            }
        );
    },

    get_by_originid_destinationid: function (originAirportId, destinationAirportId, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT transfers.firstFlightId, transfers.secondFlightId, flights.flightCode as flightCode1, flights2.flightCode as flightCode2, flights.aircraft as aircraft1, flights2.aircraft as aircraft2, airports.name as originAirport, airports2.name as transferAirport, airports3.name as destinationAirport, flights.price + flights2.price as price FROM transfers join flights on transfers.firstFlightId = flights.flightid join flights as flights2 on transfers.secondFlightId = flights2.flightid join airports on transfers.originAirportId = airports.airportid join airports as airports2 on transfers.transferAirportId = airports2.airportid join airports as airports3 on transfers.destinationAirportId = airports3.airportid where transfers.originAirportId = ? and transfers.destinationAirportId = ?;"
                    conn.query(query, [originAirportId, destinationAirportId], (err, result) => {
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
}

module.exports = Transfer;