const express = require('express');
const path = require('path');
const driver = require('bigchaindb-driver');
const routerics = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//config = require('./config');
var claim_controller = require('../controllers/claimController');
var hbill_controller = require('../controllers/hbillController');
var obill_controller = require('../controllers/obillController');
var penal_controller = require('../controllers/penalController');



routerics.get('/', function(req, res){
    console.log("Hello!");
    res.render(path.join(__dirname, "../public/pages/index"));
    res.sendFile(path.join(__dirname, "../public/pages/index.html"));
})

routerics.post('/calc', penal_controller.calculate);

routerics.get('/claims', claim_controller.claims_list);

routerics.get('/obills', obill_controller.obills);
// routerics.get('/obills', function(req, res){
//     res.render(path.join(__dirname, "../public/pages/obills"));
// })
routerics.get('/hbills', hbill_controller.OEhbillList);

module.exports = routerics;
