const dbconnect = require('./databaseConfig');

const Booking = {
    insert: function (flightid, userid, name, passport, nationality, seatType, age, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err){
                    return callback(err, null)
                } else {
                    var query = "INSERT into bookings (flightid, userid, username, passport_number, nationality, seatType, age) values(?, ?, ?, ?, ?, ?, ?)"
                    conn.query(query, [flightid, userid, name, passport, nationality, seatType, age], (err, result) =>{
                        conn.end()
                        if(err){
                            return callback(err, null)
                        } else {
                            var bookingid = (result.insertId).toString()
                            return callback(null, bookingid)
                        }
                    })
                }
            } 
        )
    },
    getAllbyId: function (userid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err, null)
                } else {
                    var query = "SELECT b.flightid, b.userid, b.username, b.seatType, f.flightCode, f.aircraft, a.airport_name as OriginAirport, a.airport_country as OriginCountry, a2.airport_name as DestinationAirport, a2.airport_country as DestinationCountry, f.embarkDate, f.embarkTime, f.travelTime, f.price from bookings b join flights f on b.flightid = f.flightid join airports a on a.airportid = f.originAirport join airports a2 on a2.airportid = f.destinationAirport where userid = ?"
                    conn.query(query, [userid], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null)
                        } else {
                            return callback(null, result)
                        }
                    })
                }
            })
    },
}

module.exports = Booking;