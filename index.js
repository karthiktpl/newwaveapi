const express = require('express')
const path = require('path')
const app = express();
const mysql = require('mysql')
const cors = require("cors");
const cookieParser = require('cookie-parser');
// const moment = require('moment')
require('dotenv/config')
var corsOptions = {
    origin: "http://localhost:8000"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());

/* app.use('/api/departments',require('./routs/api/departments'));
app.use('/api/employees',require('./routs/api/employees'));
app.use('/api/shifts',require('./routs/api/shifts'));
app.use('/api/locations',require('./routs/api/locations'));
app.use('/api/sublocations',require('./routs/api/sublocations'));
app.use('/api/machines',require('./routs/api/machines'));
app.use('/api/users',require('./routs/api/users')); */
app.use('/api/schools',require('./app/routes/schools'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))

// moment("03:15 PM", ["h:mm A"])

// var date = new Date(66600*1000);
// const time = moment(date).format("hh:mm");
// // const time =moment.unix().format("hh:mm a");
// //const setTime = moment(time,'hh:mm A').
// console.log(date);
// console.log(time);
// console.log(setTime);