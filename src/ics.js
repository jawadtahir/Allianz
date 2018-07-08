const express = require('express');
const path = require('path');
const driver = require('bigchaindb-driver');
const routerics = express.Router();

//config = require('./config');
var claim_controller = require('../controllers/claimController');
var hbill_controller = require('../controllers/hbillController');

var oe_controller = require('../controllers/OEBillcontroller')

routerics.get('/', function(req, res){
    console.log("Hello!");
    res.render(path.join(__dirname, "../public/pages/index"));
    res.sendFile(path.join(__dirname, "../public/pages/index.html"));
})

routerics.get('/claims', claim_controller.claims_list);

routerics.get('/obills', oe_controller.bill_list);


//routerics.get('/obills', function(req, res){
    //res.render(path.join(__dirname, "../public/pages/obills"));
//})
routerics.get('/hbills', function(req, res){
    res.render(path.join(__dirname, "../public/pages/hbills"));
})

routerics.get('/hbills', hbill_controller.OEhbillList);

module.exports = routerics;
