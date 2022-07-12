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

/* Multer options to store files on server */
var storage = multer.diskStorage(
    {
        // destination function to determine where to store the file
        destination: './public/images/',
        // filename function to determine what to name the file
        filename: function (req, file, callback) {
            // fileFilter function to determine if the file is allowed
            if (!file.originalname.match(/\.(png|jpg|PNG|JPG)$/)) {
                return callback(new Error('Only .jpg and .png images are allowed'))
            } else {
                // change the name of the file to the current timestamp
                // hash the original name of the file to prevent duplicate files
                var hashedName = crypto.createHash('sha256').update(file.originalname).digest('hex');
                callback(null, 'pfp' + '_' + Date.now() + '_' + hashedName + '.png');
            }
        },
        // limits the size of the file
        limits: {
            fileSize: 1000000
        },
        // on error while uploading deletes the file 
        onError: function (err, next) {
            // delete the file
            fs.unlink(file.path, function (err) {
            });
        },
    }
);

const upload = multer({ storage: storage });

const User = require('../models/user');
const Airport = require('../models/airport');
const Flight = require('../models/flight');
const Booking = require('../models/booking');
// const Transfer = require('../-Oldmodels/transfer');
// const flightImage = require('../-Oldmodels/flightImage');
// const Promotion = require('../-Oldmodels/promotion');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const defaultErrMsg = {"message": "Unknown error"}

app.post('/api/register', (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var contact = req.body.contact;
    var role = req.body.role;
    var profile_pic_url = "public/images/pfp_default.png";
    profile_pic_url = req.body.profile_pic_url;
    try{
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
    } catch(e){
        res.status(500).send(defaultErrMsg)
    }
})

app.post('/api/login', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    password = password.toString();
    try{
        User.login(email, password, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    const payload = { userid: result.userid, email: result.email, role: result.role };
                    jwt.sign(payload, JWT_SECRET, { algorithm: "HS256"  }, (err, token) => {
                        if (err) {
                            res.status(500).send(defaultErrMsg);
                        } else {
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
    } catch(e){
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
    try{
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
    } catch(e){
        res.status(500).send(defaultErrMsg)
    }
})

// post profile picture
app.post('/api/user/:userid/profile_pic', verifyToken, upload.single('profile_pic'), (req, res, next) => {
    var userid = parseInt(req.params.userid);
    var imagePath = req.file.path;
    if (isNaN(userid)) {
        res.status(400).send({ "message": "Invalid userid" });
        return;
    }
    // check the logged in user is the same as the userid provided
    if (req.decodedToken.userid != userid) {
        res.status(403).send({ "message": "You are not authorized to view this user" });
        return;
    }
    try{
        User.uploadProfilePic(userid, imagePath, (err, result) => {
            if (err) {
                // console.log(err)
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send(defaultErrMsg);
                }
            }
        })
    } catch(e){
        res.status(500).send(defaultErrMsg)
    }
})

//post airport details
app.post('/api/airport', verifyToken, (req, res, next) => {
    var airport_name = req.body.airport_name;
    var airport_country = req.body.airport_country;
    var airport_description = req.body.airport_description;
    try{
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
    } catch(e){
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/airport', (req, res, next) => {
    try{
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
    } catch(e){
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
    var price = req.body.price;
    try{
        Flight.insert(flightCode, aircraft, originAirport, destinationAirport, embarkDate, embarkTime, travelTime, price, (err, flightid) => {
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
    } catch(e){
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/flights', (req, res, next) => {
    try{
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
    } catch(e){
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/flights/:originAirport/:destinationAirport/:departDate/:returnDate/:type', (req, res, next) => {
    var originAirport = parseInt(req.params.originAirport);
    var destinationAirport = parseInt(req.params.destinationAirport);
    var embarkDate = req.params.departDate;
    var returnDate = req.params.returnDate;
    var type = req.params.type;
    console.log(originAirport, destinationAirport, embarkDate, returnDate, type);
    try{
        if(type == "one_way"){
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
        } else if (type == "return"){
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
    } catch(e){
        res.status(500).send(defaultErrMsg)
    }
})

app.get('/api/flights/:flightid', (req, res, next) => {
    var flightid = parseInt(req.params.flightid);
    try{
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
    } catch(e){
        res.status(500).send(defaultErrMsg)
    }
})

module.exports = app;