const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
const verifyToken = require("../auth/verifyToken");
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

// const upload = multer({ dest: './public/images/'});

const User = require('../models/user');
const Airport = require('../models/airport');
const Flight = require('../models/flight');
const Booking = require('../models/booking');
const Shoppingcart = require('../models/shoppingcart');
// const Transfer = require('../-Oldmodels/transfer');
// const flightImage = require('../-Oldmodels/flightImage');
const Promotion = require('../models/promotion');
const Promotiontnsf = require('../models/promotiontnsf');
const PromotionTnsf = require('../models/promotiontnsf');

/* Multer options to store files on server */
var storage = multer.diskStorage({
    // destination function to determine where to store the file
    destination: function (req, file, cb) {
        cb(null, './public/images/')
    },
    // filename function to determine what to name the file
    filename: function (req, file, callback) {
        // fileFilter function to determine if the file is allowed
        console.log(file.originalname);
        if (!file.originalname.match(/\.(png|jpg|PNG|JPG)$/)) {
            return callback(new Error('Only .jpg and .png images are allowed'))
        } else {
            // change the name of the file to the current timestamp
            // hash the original name of the file to prevent duplicate files
            var hashedName = crypto.createHash('sha256').update(file.originalname).digest('hex');
            // console.log(hashedName);
            callback(null, 'pfp' + '_' + Date.now() + '_' + hashedName + '.png');
            // callback(null, file.originalname);
        }
    },
    // on error while uploading deletes the file 
    onError: function (err, next) {
        // delete the file
        fs.unlink(file.path, function (err) {
        });
        next(err);
    },
});

var storageFlightseatpic = multer.diskStorage({
    // destination function to determine where to store the file
    destination: function (req, file, cb) {
        cb(null, './public/images/')
    },
    // filename function to determine what to name the file
    filename: function (req, file, callback) {
        // fileFilter function to determine if the file is allowed
        console.log(file.originalname);
        if (!file.originalname.match(/\.(png|jpg|PNG|JPG)$/)) {
            return callback(new Error('Only .jpg and .png images are allowed'))
        } else {
            // change the name of the file to the current timestamp
            // hash the original name of the file to prevent duplicate files
            // var hashedName = crypto.createHash('sha256').update(file.originalname).digest('hex');
            console.log(file.originalname);
            callback(null, 'flt' + '_' + file.originalname.split('.')[0] + '_flightseats.png');
            // callback(null, file.originalname);
        }
    },
    // on error while uploading deletes the file 
    onError: function (err, next) {
        // delete the file
        fs.unlink(file.path, function (err) {
        });
        next(err);
    },
});
const upload = multer({ storage: storage });
const uploadFlightseatpic = multer({ storage: storageFlightseatpic });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const defaultErrMsg = { "message": "Unknown error" }

app.post('/api/register', (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var contact = req.body.contact;
    var role = req.body.role;
    var profile_pic_url = "public/images/pfp_default.png";
    profile_pic_url = req.body.profile_pic_url;
    try {
        User.insert(username, email, password, contact, role, profile_pic_url, (err, userid) => {
            if (err) {
                if (err.errno == 1062) {
                    var errmsg = {
                        "message": "The new username OR new email provided already exists"
                    };
                    res.status(422).send(errmsg);
                } else {
                    console.log(err);
                    res.status(500).send(defaultErrMsg);
                }
            } else {
                var successmsg = {
                    "userid": userid
                };
                res.status(201).send(successmsg);
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.post('/api/login', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    password = password.toString();
    try {
        User.login(email, password, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    const payload = { userid: result.userid, email: result.email, role: result.role };
                    jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (err, token) => {
                        if (err) {
                            res.status(500).send(defaultErrMsg);
                        } else {
                            // console.log(token)
                            var successmsg = {
                                "userid": result.userid,
                                "email": result.email,
                                "role": result.role,
                                "token": token,
                            };
                            res.status(200).send(successmsg);
                        }
                    });
                } else {
                    res.status(401).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/user/:userid', verifyToken, (req, res, next) => {
    var userid = parseInt(req.params.userid);
    if (isNaN(userid)) {
        res.status(400).send({ "message": "Invalid userid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.userid != userid) {
        res.status(403).send({ "message": "You are not authorized to view this user" });
        return;
    }
    try {
        User.getUserById(userid, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    var successmsg = {
                        "userid": result.userid,
                        "username": result.username,
                        "email": result.email,
                        "contact": result.contact,
                        "role": result.role,
                        "profile_pic_url": result.profile_pic_url,
                        "created_at": result.created_at,
                    };
                    res.status(200).send(successmsg);
                } else {
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/users', verifyToken, (req, res, next) => {
    // check the logged in user is the same as the userid provided
    // console.log(req.decodedToken.role)
    // console.log(req.decodedToken)
    if (req.decodedToken.role !== "Admin") {
        res.status(403).send({ "message": "You are not authorized to view this user" });
        return;
    }
    try {
        User.getAll((err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.put('/api/user/admin/edit/:userid', verifyToken, (req, res, next) => {
    var userid = parseInt(req.params.userid);
    if (isNaN(userid)) {
        res.status(400).send({ "message": "Invalid userid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.role !== "Admin") {
        res.status(403).send({ "message": "You are not authorized to edit this user" });
        return;
    }
    var username = req.body.username;
    var email = req.body.email;
    var contact = req.body.contact;
    var role = req.body.role;
    try {
        User.updateUser(userid, username, email, contact, role, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    var successmsg = {
                        "userid": result.userid,
                    };
                    res.status(200).send(successmsg);
                } else {
                    console.log(err)
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

// post profile picture
app.post('/api/user/:userid/profile_pic', upload.single('profile_pic'), (req, res, next) => {
    var userid = parseInt(req.params.userid);
    // decode the token to get userid
    var imagePath = req.file.path;
    if (isNaN(userid)) {
        res.status(400).send({ "message": "Invalid userid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    // if (req.decodedToken.userid !== userid) {
    //     res.status(403).send({ "message": "You are not authorized to view this user" });
    //     return;
    // }
    try {
        console.log(userid, imagePath)
        User.uploadProfilePic(userid, imagePath, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    console.log(err)
                    res.status(404).send(defaultErrMsg);
                }
            }
        })
    } catch (e) {
        console.log(err)
        res.status(500).send(defaultErrMsg)
    }
})

//post airport details
app.post('/api/airport', verifyToken, (req, res, next) => {
    var airport_name = req.body.airport_name;
    var airport_country = req.body.airport_country;
    var airport_description = req.body.airport_description;
    try {
        Airport.insert(airport_name, airport_country, airport_description, (err, airportid) => {
            if (err) {
                if (err.errno == 1062) {
                    var errmsg = {
                        "message": "The new airport name OR new airport code provided already exists"
                    };
                    res.status(422).send(errmsg);
                } else {
                    console.log(err);
                    res.status(500).send(defaultErrMsg);
                }
            } else {
                var successmsg = {
                    "airportid": airportid
                };
                res.status(201).send(successmsg);
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/airport', (req, res, next) => {
    try {
        Airport.getAll((err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/airport/:airportid', (req, res, next) => {
    var airportid = parseInt(req.params.airportid);
    if (isNaN(airportid)) {
        res.status(400).send({ "message": "Invalid airportid" });
        return;
    }
    try {
        Airport.getById(airportid, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.put('/api/airport/put/:airportid', verifyToken, (req, res, next) => {
    var airportid = parseInt(req.params.airportid);
    if (isNaN(airportid)) {
        res.status(400).send({ "message": "Invalid airportid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.role !== "Admin") {
        res.status(403).send({ "message": "You are not authorized to edit this airport" });
        return;
    }
    var airport_name = req.body.airport_name;
    var airport_country = req.body.airport_country;
    var airport_description = req.body.airport_description;
    // console.log(airportid + " " + airport_name + " " + airport_country+ " " + airport_description);
    try {
        Airport.update(airportid, airport_name, airport_country, airport_description, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    console.log(err);
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        console.log(e)
        res.status(500).send(defaultErrMsg)
    }
})

app.delete('/api/airport/delete/:airportid', verifyToken, (req, res, next) => {
    var airportid = parseInt(req.params.airportid);
    if (isNaN(airportid)) {
        res.status(400).send({ "message": "Invalid airportid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.role !== "Admin") {
        res.status(403).send({ "message": "You are not authorized to delete this airport" });
        return;
    }
    try {
        Airport.deleteById(airportid, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    var successmsg = {
                        "message": "Airport deleted successfully"
                    };
                    res.status(200).send(successmsg);
                } else {
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.post('/api/flights', verifyToken, (req, res, next) => {
    var flightCode = req.body.flightCode;
    var aircraft = req.body.aircraft;
    var originAirport = req.body.originAirport;
    var destinationAirport = req.body.destinationAirport;
    var embarkDate = req.body.embarkDate;
    var embarkTime = req.body.embarkTime;
    var travelTime = req.body.travelTime;
    var flightseat_pic_url = "public\\images\\flt_0_default.png";
    var price = req.body.price;
    try {
        Flight.insert(flightCode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelTime, price, flightseat_pic_url, (err, flightid) => {
            if (err) {
                if (err.errno == 1062) {
                    var errmsg = {
                        "message": "The new flight name provided already exists"
                    };
                    res.status(422).send(errmsg);
                } else {
                    console.log(err);
                    res.status(500).send(defaultErrMsg);
                }
            } else {
                var successmsg = {
                    "flightid": flightid
                };
                res.status(201).send(successmsg);
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/flights', (req, res, next) => {
    try {
        Flight.getAll((err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ "message": "No flights found" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/flights/:originAirport/:destinationAirport/:departDate/:returnDate/:type', (req, res, next) => {
    var originAirport = parseInt(req.params.originAirport);
    var destinationAirport = parseInt(req.params.destinationAirport);
    var embarkDate = req.params.departDate;
    var returnDate = req.params.returnDate;
    var type = req.params.type;
    // console.log(originAirport, destinationAirport, embarkDate, returnDate, type);
    try {
        if (type == "one_way") {
            Flight.getByOriginDestination(originAirport, destinationAirport, embarkDate, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(defaultErrMsg);
                } else {
                    if (result) {
                        var successmsg = {
                            "one_way": result
                        }

                        res.status(200).send(successmsg);
                    } else {
                        res.status(404).send({ "message": "No flights found" });
                    }
                }
            });
        } else if (type == "return") {
            Flight.getByOriginDestination(originAirport, destinationAirport, embarkDate, (err, ODresult) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(defaultErrMsg);
                } else {
                    if (ODresult) {
                        var ODresultJSON = {
                            "one_way": ODresult,
                        }
                        Flight.getByOriginDestination(destinationAirport, originAirport, returnDate, (err, DOresult) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send(defaultErrMsg);
                            } else {
                                if (DOresult) {
                                    var DOresultJSON = {
                                        "return": DOresult,
                                    }
                                    // combine the two results
                                    // console.log(ODresult)
                                    var result = Object.assign(ODresultJSON, DOresultJSON);
                                    res.status(200).send(result);
                                } else {
                                    res.status(404).send({ "message": "No flights found" });
                                }
                            }
                        });
                    } else {
                        res.status(404).send({ "message": "No flights found" });
                    }
                }
            });
        } else {
            res.status(400).send({ "message": "Invalid request type" });
        }
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/flights/returnonly/:originAirport/:destinationAirport/:departDate/:returnDate/:type', (req, res, next) => {
    var originAirport = parseInt(req.params.originAirport);
    var destinationAirport = parseInt(req.params.destinationAirport);
    var embarkDate = req.params.departDate;
    var returnDate = req.params.returnDate;
    var type = req.params.type;
    // console.log(originAirport, destinationAirport, embarkDate, returnDate, type);
    try {
        Flight.getByOriginDestination(destinationAirport, originAirport, returnDate, (err, DOresult) => {
            if (err) {
                console.log(err);
                res.status(500).send(defaultErrMsg);
            } else {
                if (DOresult) {
                    var DOresultJSON = {
                        "return": DOresult,
                    }
                    // combine the two results
                    // console.log(ODresult)
                    res.status(200).send(DOresultJSON);
                } else {
                    res.status(404).send({ "message": "No flights found" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/flights/:flightid', (req, res, next) => {
    var flightid = parseInt(req.params.flightid);
    try {
        Flight.getByFlightid(flightid, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ "message": "No flights found" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.put('/api/flights/put/:flightid', verifyToken, (req, res, next) => {
    var airportid = parseInt(req.params.airportid);
    if (isNaN(airportid)) {
        res.status(400).send({ "message": "Invalid airportid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.role !== "Admin") {
        res.status(403).send({ "message": "You are not authorized to delete this airport" });
        return;
    }
    var flightid = parseInt(req.params.flightid);
    var flightCode = req.body.flightCode;
    var aircraft = req.body.aircraft;
    var originAirport = req.body.originAirport;
    var destinationAirport = req.body.destinationAirport;
    var embarkDate = req.body.embarkDate;
    var embarkTime = req.body.embarkTime;
    var travelTime = req.body.travelTime;
    var price = req.body.price;
    try {
        Flight.update(flightid, flightCode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelTime, price, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    var successmsg = {
                        "message": "Flight updated successfully"
                    };
                    res.status(200).send(successmsg);
                } else {
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.put('/api/flights/flightseatpic/post/:flightid', verifyToken, uploadFlightseatpic.single('flightseat_pic'), (req, res, next) => {
    var flightid = parseInt(req.params.flightid);
    var imagePath = req.file.path;
    if (isNaN(flightid)) {
        res.status(400).send({ "message": "Invalid flightid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.role !== "Admin") {
        res.status(403).send({ "message": "You are not authorized to delete this airport" });
        return;
    }
    var file = req.file;
    if (!file) {
        res.status(400).send({ "message": "No file uploaded" });
        return;
    }
    var filePath = file.path;
    try {
        Flight.updateFlightseatpic(flightid, imagePath, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    var successmsg = {
                        "message": "Flight updated successfully"
                    };
                    res.status(200).send(successmsg);
                } else {
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.delete('/api/flights/delete/:flightid', verifyToken, (req, res, next) => {
    var flightid = parseInt(req.params.flightid);
    if (isNaN(flightid)) {
        res.status(400).send({ "message": "Invalid flightid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.role !== "Admin") {
        res.status(403).send({ "message": "You are not authorized to delete this airport" });
        return;
    }
    try {
        Flight.delete(flightid, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    var successmsg = {
                        "message": "Flight deleted successfully"
                    };
                    res.status(200).send(successmsg);
                } else {
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.post('/api/shoppingcart/:userid/:flightid', verifyToken, (req, res, next) => {
    var flightid = parseInt(req.params.flightid);
    var userid = parseInt(req.params.userid);
    var seatType = req.body.seatType;
    var totalPrice = req.body.totalPrice;
    // var name = req.body.name;
    // var passport = req.body.passport;
    // var nationality = req.body.nationality;
    // var age = req.body.age;
    try {
        Shoppingcart.insert(userid, flightid, seatType, totalPrice, (err, shoppingcartid) => {
            if (err) {
                if (err.errno == 1048) {
                    console.log(err)
                    res.status(400).send({ "message": "Values cannot be empty" })
                } else {
                    console.log(err)
                    res.status(500).send(defaultErrMsg);
                }
            } else {
                var successmsg = {
                    "shoppingcartid": shoppingcartid
                };
                res.status(201).send(successmsg);
            }
        });
    } catch (e) {
        console.log(e)
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/shoppingcart/:userid', verifyToken, (req, res, next) => {
    var userid = parseInt(req.params.userid);
    try {
        Shoppingcart.getAllbyId(userid, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ "message": "No shoppingcart found" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.delete('/api/shoppingcart/del/:shoppingcartid', verifyToken, (req, res, next) => {
    var shoppingcartid = parseInt(req.params.shoppingcartid);
    try {
        Shoppingcart.removeById(shoppingcartid, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ "message": "No shoppingcart found" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.post('/api/booking/:userid/:flightid', verifyToken, (req, res, next) => {
    var flightid = parseInt(req.params.flightid);
    var userid = parseInt(req.params.userid);
    var seatType = req.body.seatType;
    var name = req.body.name;
    var passport = req.body.passport;
    var nationality = req.body.nationality;
    var age = parseInt(req.body.age);
    Booking.insert(flightid, userid, name, passport, nationality, seatType, age, (err, bookingid) => {
        if (err) {
            console.log(err)
            res.status(500).send(defaultErrMsg)
        } else {
            if (bookingid) {
                res.status(200).send(bookingid)
            } else {
                res.status(404).send({ "message": "Error in bookings, please try again!" })
            }
        }
    })
})

app.get('/api/getbooking/:userid', verifyToken, (req, res, next) => {
    var userid = parseInt(req.params.userid);
    Booking.getAllbyId(userid, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send(defaultErrMsg)
        } else {
            if (result) {
                res.status(200).send(result)
            } else {
                res.status(404).send({ "message": "No bookings found" })
            }
        }
    })
})

//promotions

app.put('/api/promotions/cart/update/:cartid', verifyToken, (req, res, next) => {
    var cartid = parseInt(req.params.cartid);
    var totalPrice = parseInt(req.body.totalPrice);
    try {
        Shoppingcart.updateTotalPricePromotion(cartid, totalPrice, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send(defaultErrMsg)
            } else {
                if (result) {
                    res.status(200).send(result)
                } else {
                    res.status(404).send({ "message": "No promotions found" })
                }
            }
        })
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.post('/api/promotions/post', verifyToken, (req, res, next) => {
    var startdate = req.body.promotionstartdate;
    var enddate = req.body.promotionenddate;
    var discount = parseInt(req.body.discountoffered);
    var promotioncode = req.body.promotioncode;
    // check that the startdate is in DD-MM-YYYY format using regex
    // if (startdate > enddate) {
    //     res.status(400).send({ "message": "Start date must be before end date" });
    //     return;
    // }
    try {
        Promotion.insert(startdate, enddate, discount, promotioncode, (err, promotionid) => {
            if (err) {
                console.log(err)
                res.status(500).send(defaultErrMsg);
            } else {
                if (promotionid) {
                    var successmsg = {
                        "promotionid": promotionid
                    };
                    res.status(200).send(successmsg);
                } else {
                    res.status(404).send({ "message": "Error in promotions, please try again!" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/promotions/get', verifyToken, (req, res, next) => {
    try {
        Promotion.getAll((err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ "message": "No promotions found" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.delete('/api/promotions/delete/:promotionid', verifyToken, (req, res, next) => {
    var promotionid = parseInt(req.params.promotionid);
    if (isNaN(promotionid)) {
        res.status(400).send({ "message": "Invalid promotionid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.role !== "Admin") {
        res.status(403).send({ "message": "You are not authorized to delete this airport" });
        return;
    }
    try {
        Promotion.delete(promotionid, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    var successmsg = {
                        "message": "Promotion deleted successfully"
                    };
                    res.status(200).send(successmsg);
                } else {
                    res.status(404).send(defaultErrMsg);
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.post('/api/promotiontnsf/post', verifyToken, (req, res, next) => {
    var promotionid = parseInt(req.body.fk_promotionid);
    var flightid = parseInt(req.body.fk_flightid);
    try {
        PromotionTnsf.insert(promotionid, flightid, (err, promotiontnsfid) => {
            if (err) {
                if (err.errno === 1452) {
                    res.status(400).send({ "message": "Invalid promotionid or flightid" });
                }
                console.log(err)
                res.status(500).send(defaultErrMsg);
            } else {
                if (promotiontnsfid) {
                    res.status(201).send(promotiontnsfid);
                } else {
                    res.status(404).send({ "message": "Error in promotions, please try again!" });
                }
            }
        })
    } catch (e) {
        console.log(err)
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/promotiontnsf/get/:flightid', verifyToken, (req, res, next) => {
    var flightid = parseInt(req.params.flightid);
    console.log(flightid)
    try {
        PromotionTnsf.getByFlightid(flightid, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ "message": "No promotions found" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/promotiontnsf/get', verifyToken, (req, res, next) => {
    try {
        PromotionTnsf.getAll((err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ "message": "No promotions found" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.put('/api/promotions/update/:promotionid', verifyToken, (req, res, next) => {
    var promotionid = parseInt(req.params.promotionid);
    var startdate = req.body.promotionstartdate;
    var enddate = req.body.promotionenddate;
    var discount = parseInt(req.body.discountoffered);
    var promotioncode = req.body.promotioncode;
    // console.log(promotionid + " " + startdate + " " + enddate + " " + discount + " " + promotioncode)
    if (isNaN(promotionid)) {
        res.status(400).send({ "message": "Invalid promotionid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.role !== "Admin") {
        res.status(403).send({ "message": "You are not authorized to update this airport" });
        return;
    }
    try {
        Promotion.update(promotionid, startdate, enddate, discount, promotioncode, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    console.log(result)
                    var successmsg = {
                        "message": "Promotion updated successfully"
                    };
                    res.status(200).send(successmsg);
                } else {
                    res.status(404).send({ "message": "Error in promotions, please try again!" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.put('/api/promotiontnsf/update/:promotiontnsfid', verifyToken, (req, res, next) => {
    var promotiontnsfid = parseInt(req.params.promotiontnsfid);
    var promotionid = parseInt(req.body.fk_promotionid);
    var flightid = parseInt(req.body.fk_flightid);
    if (isNaN(promotiontnsfid)) {
        res.status(400).send({ "message": "Invalid promotiontnsfid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.role !== "Admin") {
        res.status(403).send({ "message": "You are not authorized to update this airport" });
        return;
    }
    try {
        PromotionTnsf.update(promotiontnsfid, promotionid, flightid, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    var successmsg = {
                        "message": "Promotion updated successfully"
                    };
                    res.status(200).send(successmsg);
                } else {
                    res.status(404).send({ "message": "Error in promotions, please try again!" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/promotions/promocode/:promotioncode', (req, res, next) => {
    var promotioncode = req.params.promotioncode;
    try {
        Promotion.getByPromoCode(promotioncode, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ "message": "No promotions found" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/promotions/promocode', (req, res, next) => {
    try {
        Promotion.getAllWithFlightcode((err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send({ "message": "No promotions found" });
                }
            }
        });
    } catch (e) {
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/favicon', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '../../favicon.ico'));
});

app.get('/', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../public/index.html'));
})

app.get('/adminpanel', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../public/adminpanel.html'));
})

app.get('/booking', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../public/booking.html'));
})

app.get('/flightDetails', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../public/flightDetails.html'));
})

app.get('/login', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../public/login.html'));
})

app.get('/profile', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../public/profile.html'));
})

app.get('/register', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../public/register.html'));
})

app.get('/searchResult', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../public/searchResult.html'));
})

app.get('/shoppingcart', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../public/shoppingcart.html'));
})

app.get('/src/css/style.css', (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../public/src/css/style.css'));
})

// send all files in image if requested
app.get('/images/*', (req, res, next) => {
    // console.log(req.params[0])
    res.status(200).sendFile(path.join(__dirname, '../public/images/' + req.params[0]));
})

// if the user goes to a route that is not defined, send them to the 404 page
app.get('*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/404.html'));
})

module.exports = app;