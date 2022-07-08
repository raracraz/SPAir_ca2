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
// const Airport = require('../-Oldmodels/airport');
// const Flight = require('../-Oldmodels/flight');
// const Booking = require('../-Oldmodels/booking');
// const Transfer = require('../-Oldmodels/transfer');
// const flightImage = require('../-Oldmodels/flightImage');
// const Promotion = require('../-Oldmodels/promotion');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const defaultErrMsg = {"message": "Unknown error"}

app.post('/api/register', (req, res) => {
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

app.post('/api/login', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    password = password.toString();
    try{
        User.login(username, password, (err, result) => {
            if (err) {
                res.status(500).send(defaultErrMsg);
            } else {
                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(401).send(defaultErrMsg);
                }
            }
        });
    } catch(e){
        res.status(500).send(defaultErrMsg)
    }
})

module.exports = app;