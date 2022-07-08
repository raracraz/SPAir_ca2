const dbconnect = require('./databaseConfig');
const crypto = require('crypto');

const User = {
    insert: function(user, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    // hash the password with sha256 before inserting it into the database
                    var hashedPassword = crypto.createHash('sha256').update(user.password).digest('hex'); // new
                    var query = "INSERT into users (username, email, contact, password, role, profile_pic_url) values (?, ?, ?, ?, ?, ?);"
                    conn.query(query, [user.username, user.email, user.contact, hashedPassword, user.role, user.profile_pic_url], (err, result) => {
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
    login: function(username, password, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    // hash the password with sha256 before comparing it with the one in the database
                    var hashedPassword = crypto.createHash('sha256').update(password).digest('hex'); // new
                    var query = "SELECT * from users where username = ? and password = ?;"
                    conn.query(query, [username, hashedPassword], (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null);
                        } else {
                            if (result.length > 0) {
                                return callback(null, result[0]);
                            } else {
                                return callback(null, null);
                            }
                        }
                    })
                }
            }
        );
    },
}

module.exports = User;