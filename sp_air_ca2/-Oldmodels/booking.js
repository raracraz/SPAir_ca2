const dbconnect = require('./databaseConfig');

const Booking = {
    insert: function(userid, flightid, booking, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into bookings (flightid, userid, name, passport, nationality, age) values (?, ?, ?, ?, ?, ?);"
                    conn.query(query, [flightid, userid, booking.name, booking.passport, booking.nationality, booking.age], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            var bookingid = (result.insertId).toString();
                            return callback(null, bookingid);
                        }
                    })
                }
            }
        );
    }
}

module.exports = Booking;