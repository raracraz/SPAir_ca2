# Intructions on Setting up
1. In order to set up the database, open MySQL Workbench, then open File > Open SQL Script > sp_air_init.sql and press execute
2. To start the server on localhost:3000, open Visual Studio Code and run server.js in the terminal
    - $ node server.js / nodemon server.js
3. To conduct the testing of Endpoints, open POSTMAN and import the following URL: http://localhost:3000/"query"
    - eg: http://localhost:3000/users/

# Database Structure
[+] Schema Name:
    [-] sp_air
[+] Tables:
    [-] users
    [-] flights
    [-] airports
    [-] transfers
    [-] images
    [-] promotions
    [-] bookings

# Additional Middlewares and Utilities Used:
[+] Multer
    [-] $ npm install multer
[+] Nodemon
    [-] $ npm install nodemon