const dbconnect = require('./databaseConfig');

const Promotion = {
    insert: function (promostatedate, promoenddate, discountoffered, promotioncode, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into promotions (promotionstartdate, promotionenddate, discountoffered, promotioncode) values (?, ?, ?, ?);"
                    conn.query(query, [promostatedate, promoenddate, discountoffered, promotioncode], (err, result) => {
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
    getAll: function (callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT * from promotions;"
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
        )
    },
    delete: function (promotionid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
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
        )
    },
    update: function (promotionid, promostatedate, promoenddate, discountoffered, promotioncode, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    var query = "UPDATE promotions SET promotionstartdate = ?, promotionenddate = ?, discountoffered = ?, promotioncode = ? WHERE promotionid = ? OUTPUT INSERTED.MyID;"
                    conn.query(query, [promostatedate, promoenddate, discountoffered, promotioncode, promotionid], (err, result) => {
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
    getByPromoCode: function (promotioncode, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT * from promotions where promotioncode = ?;"
                    conn.query(query, [promotioncode], (err, result) => {
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
    getAllWithFlightcode: function (callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function (err) {
                if (err) {
                    return callback(err);
                } else {
                    // var query = "SELECT p.promotionid, p.promotioncode, p.discountoffered, f.flightCode from promotions p join promotion_transfers pt on pt.fk_ join flights f on pt.fk_flightid = f.flightid;"
                    var query = "SELECT p.promotionid, p.promotioncode, p.discountoffered, f.flightCode from promotions p join promotion_transfers pt join flights f on pt.fk_flightid = f.flightid;"
                    conn.query(query, (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            // loop through result and remove duplicates that are exactly the same (promotionid, promotioncode, discountoffered, flightcode)
                            var uniquePromotions = [];
                            for (var i = 0; i < result.length; i++) {
                                var promotion = result[i];
                                var found = false;
                                for (var j = 0; j < uniquePromotions.length; j++) {
                                    var uniquePromotion = uniquePromotions[j];
                                    if (uniquePromotion.promotionid == promotion.promotionid && uniquePromotion.promotioncode == promotion.promotioncode && uniquePromotion.discountoffered == promotion.discountoffered && uniquePromotion.flightCode == promotion.flightCode) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    uniquePromotions.push(promotion);
                                }
                            }
                            return callback(null, uniquePromotions);
                        }
                    })
                }
            }
        )
    }
}

module.exports = Promotion;