const express = require('express');
const path = require('path');
const config = require('./config');
app = express();
app.set("view engine", "pug");
app.set("config", config);
const DEBUG = process.env.NODE_ENV !== 'production'
const PORT = DEBUG ? '30001' : process.env.PORT;
app.use(express.static(__dirname + "/../public/"));
const ics = require("./ics");




app.use("/ics", ics);

const server = app.listen(PORT, function () {
    console.log('Express listening on port %s', PORT);
});