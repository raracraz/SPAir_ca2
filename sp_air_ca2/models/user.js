const dbconnect = require('./databaseConfig');

const User = {
    insert: function(user, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "INSERT into users (username, email, contact, password, role, profile_pic_url) values (?, ?, ?, ?, ?, ?);"
                    conn.query(query, [user.username, user.email, user.contact, user.password, user.role, user.profile_pic_url], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            var userid = (result.insertId).toString();
                            return callback(null, userid);
                        }
                    })
                }
            }
        );
    },

    get_all: function(callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT * from users;"
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
        );
    },

    get_by_id: function(userid, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "SELECT * from users where userid = ?;"
                    conn.query(query, [userid], (err, result) => {
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

    update_user: function(userid, user, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "UPDATE users SET username = ?, email = ?, contact = ?, password = ?, role = ?, profile_pic_url = ? WHERE userid = ?;"
                    conn.query(query, [user.username, user.email, user.contact, user.password, user.role, user.profile_pic_url, userid], (err, result) => {
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

module.exports = User;