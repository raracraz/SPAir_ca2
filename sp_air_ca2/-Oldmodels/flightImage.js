const dbconnect = require('./databaseConfig');

const FlightImage = {
    insert: function (fk_flightid, image_path, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    //var query = "INSERT into images (fk_flightid, image_path) values (?, ?);"
                    // insert if not exists, update if exists
                    var query = "INSERT IGNORE INTO images (fk_flightid, image_path) VALUES (?, ?) ON DUPLICATE KEY UPDATE fk_flightid=VALUES(fk_flightid), image_path=VALUES(image_path);";
                    conn.query(query, [fk_flightid, image_path], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            var imageid = (result.insertId).toString();
                            return callback(null, imageid);
                        }
                    })
                }
            }
        )
    },

    get_by_flightid_with_picture: function(flightid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT flights.flightid, flights.flightCode, flights.aircraft, airports.name as originAirport, airports2.name as destinationAirport, flights.embarkDate, flights.travelTime, flights.price, images.image_path from flights join images on flights.flightid = images.fk_flightid join airports on flights.originAirport = airports.airportID join airports as airports2 on flights.destinationAirport = airports2.airportID where flights.flightid = ?;"
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
}

module.exports = FlightImage;