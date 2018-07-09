const express = require('express');
const path = require('path');
const driver = require('bigchaindb-driver');
const routerics = express.Router();
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//config = require('./config');
var claim_controller = require('../controllers/claimController');
var hbill_controller = require('../controllers/hbillController');
var login_controller = require('../controllers/loginController')


routerics.get('/', function(req, res){
    console.log("Hello!");
    res.render(path.join(__dirname, "../public/pages/index"));
    res.sendFile(path.join(__dirname, "../public/pages/index.html"));
})

routerics.get('/claims', claim_controller.claims_list);
routerics.get('/login', login_controller.get_login_page);
routerics.post('/login', login_controller.LoginButtonReq);
routerics.get('/obills', function(req, res){
    res.render(path.join(__dirname, "../public/pages/obills"));
})
routerics.get('/hbills', hbill_controller.OEhbillList);

module.exports = routerics;
