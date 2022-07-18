const dbconnect = require('./databaseConfig');

const Booking = {
    insert: function (flightid, userid, name, passport, nationality, age, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err){
                    return callback(err, null)
                } else {
                    var query = "INSERT into bookings (flightid, userid, username, passport_number, nationality, age) values(?, ?, ?, ?, ?, ?)"
                    conn.query(query, [flightid, userid, name, passport, nationality, age], (err, result) =>{
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
}

module.exports = Booking;