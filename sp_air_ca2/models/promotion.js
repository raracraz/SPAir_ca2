const dbconnect = require('./databaseConfig');

const Promotion = {
    insert: function(flightid, promotion, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into promotions(fk_promoflightid, promostartdate, promoenddate, discountoffered) values (?, ?, ?, ?);"
                    conn.query(query, [flightid, promotion.promostartdate, promotion.promoenddate, promotion.discountoffered], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            var promotionid = (result.insertId).toString();
                            return callback(null, promotionid);
                        }
                    })
                }
            }
        );
    },

    get_by_flightid: function(flightid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT * from promotions where fk_promoflightid = ?;"
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

    delete_by_id: function(promotionid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "DELETE from promotions where promotionid = ?;"
                    conn.query(query, [promotionid], (err, result) => {
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

module.exports = Promotion;