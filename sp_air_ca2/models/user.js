const dbconnect = require('./databaseConfig');
const crypto = require('crypto');

const User = {
    insert: function(username, email, password, contact, role, profile_pic_url, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    // hash the password with sha256 before inserting it into the database
                    var hashedPassword = crypto.createHash('sha256').update(password).digest('hex'); // new
                    var query = "INSERT into users (username, email, password, contact, role, profile_pic_url) values (?, ?, ?, ?, ?, ?);"
                    conn.query(query, [username, email, hashedPassword, contact, role, profile_pic_url], (err, result) => {
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
    login: function(email, password, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    // hash the password with sha256 before comparing it with the one in the database
                    var hashedPassword = crypto.createHash('sha256').update(password).digest('hex'); // new
                    var query = "SELECT * from users where email = ? and password = ?;"
                    conn.query(query, [email, hashedPassword], (err, result) => {
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
    getUserById: function(userid, callback) {
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
    uploadProfilePic: function(userid, profile_pic_url, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var query = "UPDATE users SET profile_pic_url = ? WHERE userid = ?;"
                    conn.query(query, [profile_pic_url, userid], (err, result) => {
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
    getAll: function(callback) {
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
    updateUser: function(userid, username, email, contact, password, role, profile_pic_url, callback) {
        var conn = dbconnect.getConnection();
        conn.connect(
            function(err){
                if (err) {
                    return callback(err);
                } else {
                    var hashedPassword = crypto.createHash('sha256').update(password).digest('hex'); // new
                    var query = "UPDATE users SET username = ?, email = ?, contact = ?, password = ?, role = ?, profile_pic_url = ? WHERE userid = ?;"
                    conn.query(query, [username, email, contact, hashedPassword, role, profile_pic_url, userid], (err, result) => {
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
    }
}

module.exports = User;