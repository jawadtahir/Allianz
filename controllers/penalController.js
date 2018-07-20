const path = require('path');
const config = app.get('config');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const axios = require('axios');
var QRCode = require('qrcode');
const BILL_API_ENDPOINT = 'http://localhost:3000/api/Bill/';
const OE_API_ENDPOINT = 'http://localhost:3000/api/OE/';

exports.calculate = async function (req, res) {
    var data = req;
    data = data.body;
    data.payDate = new Date();
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(config.card_name);
    const factory = await bnc.getBusinessNetwork().getFactory();
    const serializer = await bnc.getBusinessNetwork().getSerializer();
    

    var transaction = await factory.newTransaction('de.tum.allianz.ics', 'calculatePenalty');
    transaction.billIds = data.billIds;
    transaction.payDate = data.payDate;
    var bills = await bnc.submitTransaction(transaction);
    var billList = [];
    for (var i = 0; i < bills.length;i++ ){
        var bilJson = serializer.toJSON(bills[i]);
        billList.push(bilJson);
    }
    res.header("Content-Type", "application/json");
    res.send(billList);
};

exports.billhist = async function (req, res) {
    var data = req;
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(config.card_name);
    const factory = await bnc.getBusinessNetwork().getFactory();
    const transaction = await factory.newTransaction('de.tum.allianz.ics', 'getHistroy');
    const serializer = await bnc.getBusinessNetwork().getSerializer();
    var billHist = [];

    transaction.billId = req.params["billid"];
    var resp = await bnc.submitTransaction(transaction);
    resp = resp.split('#SEP#');
    for (var i = 1; i < resp.length; i++){
        var data = resp[i];
        data = JSON.parse(data);
		data.transactionDate = new Date((data.transaction_epoch_sec * 1000));
		if(data.status == "DELETED") {
			data.dueDate = "N/A"; //Normally I should do it from Hyperledger part but dont want to create any error
			data.hoe = "N/A";
			data.ooe = "N/A";
		} else {
			data.dueDate = new Date(data.dueDate).toLocaleDateString();
        	data.hoe = data.hoe.split("#")[1];
        	data.ooe = data.ooe.split("#")[1];
		}
        if ((i%2) == 0){
            data.orientation = "timeline-inverted";
        }else {
            data.orientation = "timeline";
        }
        billHist.push(data);
    }
	var obill;
    billHist.reverse();
    QRCode.toDataURL(req.params.billid.toString(), function (err, url) {
        axios.get(BILL_API_ENDPOINT.concat(req.params.billid.toString()))
        .then(response => {
            obill = response.data;
            var date = obill.dueDate.toString().split(':')
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
            obill.dueDate = month + '/' + day + '/' + year;
            obill.ooe = obill.ooe.split('#')[1];
            obill.hoe = obill.hoe.split('#')[1];
            axios.get(OE_API_ENDPOINT.concat(obill.ooe.toString()))
                .then(resp => {
                    res.render(path.join(__dirname, "../public/pages/obillhist"), {
                        obill: obill,
                        bills: billHist,
                        user:app.get('USER'),
                        ooeIban: resp.data.IBAN,
                        QRCode: url
                    });
                });
            
        })
        .catch(error => {
            console.log("You are looking for a DELETED Bill???");
			res.render(path.join(__dirname, "../public/pages/obillhist"), {
                        bills: billHist,
                        user:app.get('USER'),
                        QRCode: url
			});
        });
    });


    
};
