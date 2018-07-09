const path = require('path');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

exports.calculate = async function (req, res) {
    var data = req;
    data = data.body;
    data.payDate = new Date();
    const bnc = new BusinessNetworkConnection();
    await bnc.connect("admin@allianz-network");
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