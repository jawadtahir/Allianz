// const BusinessNetworkConnection = require('composer-client');
// const shim = require('fabric-shim');
// var businessNetwork = new BusinessNetworkConnection.BusinessNetworkConnection();
const path = require('path');
const axios = require('axios');
var QRCode = require('qrcode');
const BILL_API_ENDPOINT = 'http://localhost:3000/api/Bill/';

exports.OEhbillList1 = async function(req,res) {
        // const id = req.params.id;
        // businessNetwork.connect('admin@allianz-network')
        //     .then(async function(businessNetworkDefinition){
        //     // Connected
        //         const nativeKey = businessNetwork.getNativeAPI().createCompositeKey('Asset:systest.transactions.Bill', [id]);
        //         const iterator = await businessNetwork.getNativeAPI().getHistoryForKey(nativeKey);
        //         let results = [];
        //         let response = {done : false};
        //         while (!response.done) {
        //             response = await iterator.next();
        //
        //             if (response && response.value && response.value.value) {
        //                 let val = response.value.value.toString('utf8');
        //                 if (val.length > 0) {
        //                     results.push(JSON.parse(val));
        //                 }
        //             }
        //             if (response && response.done) {
        //                 try {
        //                     iterator.close();
        //                 }
        //                 catch (err) {
        //                 }
        //             }
        //         }
        // });
    var hbills = [];
    QRCode.toDataURL(req.params.id.toString(), function (err, url) {
        axios.get(BILL_API_ENDPOINT.concat(req.params.id.toString()))
            .then(response => {
                hbill = response.data;
                var date = hbill.dueDate.toString().split(':')
                var dateHour = date[0];
                var min = date[1];
                var sec = date[2];
                var temp = dateHour.split('T');
                date = temp[0];
                var hour = temp[1];
                temp = date.split('-');
                var year = temp[0];
                var month = temp[1];
                var day = temp[2];
                sec = sec.split('.')[0];
                hbill.dueDate = day + '/' + month + '/' + year + ' ' + hour + ':' + min;
                hbill.ooe = hbill.ooe.split('#')[1];
                hbill.hoe = hbill.hoe.split('#')[1];
                res.render(path.join(__dirname, "../public/pages/hbillDetails"), {
                    hbill: hbill,
                    user:app.get('USER'),
                    QRCode: url
                });
            })
            .catch(error => {
                console.log(error);
            });
    })
}

