const path = require('path');
const config = app.get('config');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

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
        data.dueDate = new Date(data.dueDate).toLocaleDateString();
        if ((i%2) == 0){
            data.orientation = "timeline-inverted";
        }else {
            data.orientation = "timeline";
        }
        billHist.push(data);
    }

    billHist.reverse();
    
    
    res.render(path.join(__dirname, "../public/pages/billhist"), {
        bills: billHist,
        user: app.get("USER")
    });
};