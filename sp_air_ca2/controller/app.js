const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

/* Multer options to store files on server */
var storage = multer.diskStorage(
    {
        // destination function to determine where to store the file
        destination: './public/flight_listing_images/',
        // filename function to determine what to name the file
        filename: function (req, file, callback) {
            // fileFilter function to determine if the file is allowed
            if (!file.originalname.match(/\.(png|jpg|PNG|JPG)$/)) {
                return callback(new Error('Only .jpg and .png images are allowed'))
            } else {
                // change the name of the file to the current timestamp
                callback(null, Date.now() + '_' + file.originalname);
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
const Transfer = require('../models/transfer');
const flightImage = require('../models/flightImage');
const Promotion = require('../models/promotion');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const defaultErrMsg = {"message": "Unknown error"}

/* users */
app.post('/users/', (req, res) => {
    var user = req.body;
    try{
        User.insert(user, (err, userid) => {
            if (err) {
                if (err.errno == 1062) {
                    var errmsg = {
                        "message": "The new username OR new email provided already exists"
                    };
                    res.status(422).send(errmsg);
                } else {
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

app.get('/users/', (req, res) => {
    try{
        User.get_all((err, users) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                res.status(200).send(users);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

app.get('/users/:userid', (req, res) => {
    var userid = req.params.userid;
    try{
        User.get_by_id(userid, (err, user) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                // extra check to see if userid exists
                if (user.length == 0) {
                    var errmsg = {
                        "message": "User not found"
                    }
                    res.status(404).send(errmsg);
                } else {
                    res.status(200).send(user);
                }
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

app.put('/users/:userid', (req, res) => {
    var userid = parseInt(req.params.userid);
    var user = req.body;
    try{
        User.update_user(userid, user, (err, result) => {
            if (err) {
                if (err.errno == 1062) {
                    var errmsg = {
                        "message": "The new username OR new email provided already exists"
                    };
                    res.status(422).send(errmsg);
                } else {
                    res.status(500).send(defaultErrMsg);
                }
            } else {
                res.status(204).send();
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

/* end of users */

/* airports */

app.post('/airport/', (req, res) => {
    var airport = req.body;
    try{
        Airport.insert(airport, (err, airportid) => {
            if (err) {
                if (err.errno == 1062) {
                    var errmsg = {
                        "message": "The airport name provided already exists."
                    };
                    res.status(422).send(errmsg);
                } else {
                    res.status(500).send(defaultErrMsg);
                }
            } else {
                res.status(204).send();
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

app.get('/airport/', (req, res) => {
    try{
        Airport.get_alll((err, airports) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                res.status(200).send(airports);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

/* end of airports */

/* flights */

app.post('/flight/', (req, res) => {
    var flight = req.body;
    try{
        Flight.insert(flight, (err, flightid) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                var successmsg = {
                    "flightid": flightid
                }
                res.status(201).send(successmsg);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

app.get('/flightDirect/:originAirportId?/:destinationAirportId?', (req, res) => {
    var originAirportId = parseInt(req.params.originAirportId);
    var destinationAirportId = parseInt(req.params.destinationAirportId);
    try{
        Flight.get_by_originID_destinationID(originAirportId, destinationAirportId, (err, flights) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                res.status(200).send(flights);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

app.delete('/flight/:flightid', (req, res) => {
    var flightid = parseInt(req.params.flightid);
    try{
        Flight.delete_by_id(flightid, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                var successmsg = {
                    "message": "Deletion successful"
                }
                res.status(200).send(successmsg);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

/* end of flights */

/* Booking */

app.post('/booking/:userid?/:flightid?', (req, res) => {
    var userid = parseInt(req.params.userid);
    var flightid = parseInt(req.params.flightid);
    var booking = req.body;
    try{
        Booking.insert(userid, flightid, booking, (err, bookingid) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                var successmsg = {
                    "bookingid": bookingid
                }
                res.status(201).send(successmsg);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

/* end of booking */

/* Transfers */

app.post('/transfer/flight/:originAirportId?/:destinationAirportId?', (req, res) => {
    var originAirportId = parseInt(req.params.originAirportId);
    var destinationAirportId = parseInt(req.params.destinationAirportId);
    var transfer = req.body;
    try{
        Transfer.insert(originAirportId, destinationAirportId, transfer, (err, transferid) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                var successmsg = {
                    "transferid": transferid
                }
                res.status(201).send(successmsg);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

app.get('/transfer/flight/:originAirportId?/:destinationAirportId?', (req, res) => {
    var originAirportId = parseInt(req.params.originAirportId);
    var destinationAirportId = parseInt(req.params.destinationAirportId);
    try{
        Transfer.get_by_originid_destinationid(originAirportId, destinationAirportId, (err, transfers) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                res.status(200).send(transfers);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

/* end of transfers */

/* images */

app.post('/images/:flightid', upload.single('image'), (req, res) => {
    var fk_flightid = parseInt(req.params.flightid);
    // use multer to handle the file upload
    var image_path = req.file.path;
    try{
        flightImage.insert(fk_flightid, image_path, (err, imageid) => {
            if (err) {
                // delete the uploaded file if error
                fs.unlink(image_path)
                res.status(500).send(defaultErrMsg);
            } else {
                var successmsg = {
                    "imageid": imageid
                }
                res.status(201).send(successmsg);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})


app.get('/flight/images/:flightid', (req, res) => {
    var flightid = parseInt(req.params.flightid);
    try{
        flightImage.get_by_flightid_with_picture(flightid, (err, images) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                res.status(200).send(images);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

/* end of images */

/* Promotions */

app.post('/promotion/:flightid', (req, res) => {
    var flightid = parseInt(req.params.flightid);
    var promotion = req.body;
    try{
        Promotion.insert(flightid, promotion, (err, promotionid) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                var successmsg = {
                    "promotionid": promotionid
                }
                res.status(201).send(successmsg);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

app.get('/promotion/:flightid', (req, res) => {
    var flightid = parseInt(req.params.flightid);
    try{
        Promotion.get_by_flightid(flightid, (err, promotions) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                res.status(200).send(promotions);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

app.delete('/promotion/:promotionid', (req, res) => {
    var promotionid = parseInt(req.params.promotionid);
    try{
        Promotion.delete_by_id(promotionid, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                var successmsg = {
                    "message": "Deletion successful"
                }
                res.status(200).send(successmsg);
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg);
    }
})

/* end of promotions */

module.exports = app;