const express = require('express');
const path = require('path');
const driver = require('bigchaindb-driver');
const routerics = express.Router();

//config = require('./config');
var claim_controller = require('../controllers/claimController');

var oe_controller = require('../controllers/OEBillcontroller')

routerics.get('/', function(req, res){
    console.log("Hello!");
    res.render(path.join(__dirname, "../public/pages/index"));
})

routerics.get('/claims', claim_controller.claims_list);

routerics.get('/obills', oe_controller.bill_list);


//routerics.get('/obills', function(req, res){
    //res.render(path.join(__dirname, "../public/pages/obills"));
//})
routerics.get('/hbills', function(req, res){
    res.render(path.join(__dirname, "../public/pages/hbills"));
})

module.exports = routerics;
