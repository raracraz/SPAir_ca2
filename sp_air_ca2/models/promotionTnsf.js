const dbconnect = require('./databaseConfig');

const PromotionTnsf = {
    insert: function (fk_promotionid, fk_flightid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into promotion_transfers (fk_promotionid, fk_flightid) values (?, ?);"
                    conn.query(query, [fk_promotionid, fk_flightid], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            var promotiontnsfid = (result.insertId).toString();
                            return callback(null, promotiontnsfid);
                        }
                    })
                }
            }
        );
    },
    getByFlightid: function (flightid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT p.promotionstartdate, p.promotionenddate, discountoffered, promotioncode from promotion_transfers pt join promotions p on pt.fk_promotionid = p.promotionid where pt.fk_flightid = ?;"
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
        )
    },
    getAll: function (callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT * from promotion_transfers;"
                    conn.query(query, (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    })
                }
            })
    },
    update: function (promotiontnsfid, fk_promotionid, fk_flightid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    var query = "UPDATE promotion_transfers SET fk_promotionid = ?, fk_flightid = ? where promotiontnsfid = ?;"
                    conn.query(query, [fk_promotionid, fk_flightid, promotiontnsfid], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    })
                }
            }
        )
    }
}

module.exports = PromotionTnsf;