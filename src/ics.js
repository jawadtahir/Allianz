const express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const path = require('path');
const driver = require('bigchaindb-driver');
var bodyParser = require('body-parser');
var morgan = require('morgan');
const routerics = express.Router();
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000000
    }
}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


var sessionChecker = (req, res, next) => {
    if (!req.session.user || !req.cookies.user_sid) {
        res.render(path.join(__dirname, "../public/pages/login"));
    }  
    next();
};

//config = require('./config');
var claim_controller = require('../controllers/claimController');
var hbill_controller = require('../controllers/hbillController');
var hbillDetails_controller = require('../controllers/hbillDetailsController');
var obill_controller = require('../controllers/obillController');
var penal_controller = require('../controllers/penalController');
var login_controller = require('../controllers/loginController');
var dashboard_controller = require('../controllers/dashboardController');

routerics.get('/', sessionChecker, dashboard_controller.get_dashboard_data);

routerics.get('/login', login_controller.get_login_page);

routerics.post('/login', login_controller.login_request);
// To calculate late penality
routerics.post('/calc', penal_controller.calculate);
// To show bill history
routerics.get('/billhist/:billid', penal_controller.billhist);

routerics.post('/edit_bill/:id', obill_controller.editBill );

routerics.get('/claims', sessionChecker, claim_controller.claims_list);

routerics.post('/claims',claim_controller.update_claims);

routerics.get('/obills', sessionChecker, obill_controller.obills);

routerics.get('/hbills', sessionChecker, hbill_controller.OEhbillList);
routerics.get('/hbill/:id', sessionChecker, hbillDetails_controller.OEhbillList1);
routerics.get('/logout', function (req, res) {
    app.set('USER', new Object());

    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.render(path.join(__dirname, "../public/pages/login"));
    } else {
        res.render(path.join(__dirname, "../public/pages/index"));
    }});

module.exports = routerics;
