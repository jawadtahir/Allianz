const express = require('express');
const path = require('path');
const driver = require('bigchaindb-driver');
const routerics = express.Router();

//config = require('./config');
var claim_controller = require('../controllers/claimController');



routerics.get('/', function(req, res){
    res.sendFile(path.join(__dirname, "../public/pages/index.html"));
})

routerics.get('/claims', claim_controller.claims_list);

routerics.get('/obills', function(req, res){
    res.sendFile(path.join(__dirname, "../public/pages/obills.html"));
})
routerics.get('/hbills', function(req, res){
    res.sendFile(path.join(__dirname, "../public/pages/hbills.html"));
})

module.exports = routerics;

