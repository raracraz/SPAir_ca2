const dbconnect = require('./databaseConfig');

const Shoppingcart = {
    insert: function (userid, flightid, seatType, totalPrice, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err, null)
                } else {
                    var query = "INSERT into shoppingcart (userid, flightItemid, seatType, totalPrice) values(?, ?, ?, ?)"
                    conn.query(query, [userid, flightid, seatType, totalPrice], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null)
                        } else {
                            var shoppingcartid = (result.insertId).toString()
                            return callback(null, shoppingcartid)
                        }
                    }
                    )
                }
            })
    },
    getAllbyId: function (userid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err, null)
                } else {
                    var query = "SELECT s.cartid, s.userid, s.flightItemid, s.seatType, s.totalPrice, a.airport_name as OriginAirport, a.airport_country as OriginCountry, a2.airport_name as DestinationAirport, a2.airport_country as DestinationCountry, f.flightCode, f.embarkDate, f.embarkTime, f.travelTime, f.price from shoppingcart s join flights f on s.flightItemid = f.flightid join airports a on f.originAirport = a.airportid join airports a2 on f.destinationAirport = a2.airportid where userid = ?"
                    conn.query(query, [userid], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null)
                        } else {
                            return callback(null, result)
                        }
                    }
                    )
                }
            }
        )
    },
    removeById: function (cartid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err, null)
                } else {
                    var query = "DELETE from shoppingcart where cartid = ?"
                    conn.query(query, [cartid], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null)
                        } else {
                            return callback(null, result)
                        }
                    }
                    )
                }
            }
        )
    },
    updateTotalPricePromotion: function (cartid, totalPrice, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err, null)
                } else {
                    var query = "UPDATE shoppingcart set totalPrice = ? where cartid = ?"
                    conn.query(query, [totalPrice, cartid], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null)
                        } else {
                            return callback(null, result)
                        }
                    }
                    )
                }
            }
        )
    }

}

module.exports = Shoppingcart;