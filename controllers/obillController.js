const path = require('path');
const axios = require('axios');
NAMESPACE = "de.tum.allianz.ics.";
RESOURCE = "resource:de.tum.allianz.ics.";

/**
 * {"where":{"and":[{"or":[{"status":"PENDING"},{"status":"SHOULDAUTH"}]},{"ooe":"resource:de.tum.allianz.ics.OE#OE"}]}}
 */
const FILTER = "?filter=%7B%22where%22%3A%7B%22and%22%3A%5B%7B%22or%22%3A%5B%7B%22status%22%3A%22PENDING%22%7D%2C%7B%22status%22%3A%22SHOULDAUTH%22%7D%5D%7D%2C%7B%22ooe%22%3A%22resource%3Ade.tum.allianz.ics.OE%23#OE#%22%7D%5D%7D%7D";
const BILL_API_ENDPOINT = 'http://localhost:3000/api/Bill';

exports.obills = async function (req, res) {
    var authList = [];
    var pendingList = [];
    getBills(authList, pendingList, req, res);
};

function getBills(authList, pendingList, req, res) {
    var filter = createFilter(app.get("USER"));
    if (filter != undefined) {
        axios.get(BILL_API_ENDPOINT + filter).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var bill = response.data[i];
                bill.hoe = bill.hoe.split("#")[1];
                bill.dueDate = new Date(bill.dueDate).toLocaleDateString();
                if (bill.authorizor == undefined) {
                    bill.authorizor = "";
                } else {
                    bill.authorizor = bill.authorizor.split("#")[1];
                }
                if (bill.status == "PENDING") {
                    pendingList.push(bill);
                } else {
                    authList.push(bill);
                }
            }
            res.render(path.join(__dirname, "../public/pages/obills"), {
                authList: authList,
                pendingList: pendingList,
                user: app.get("USER")
            });
            
        });
    }
}

exports.editBill = function editBill(req, res) {
    axios.get(BILL_API_ENDPOINT + '/' + req.params.id).then(function (response) {
            var bill = response.data;
            var transactionData = new Object();
            transactionData.$class = NAMESPACE + 'Bill';
            transactionData.ooe = bill.ooe;
            transactionData.hoe = bill.hoe;
            transactionData.billId = bill.billId;
            transactionData.claims = bill.claims;
            transactionData.status = bill.status;
            transactionData.totalAmount = bill.totalAmount;
            transactionData.dueDate = req.body.dueDate;
            transactionData.latePenality = bill.latePenality;
            transactionData.totalOutstanding = (parseFloat(bill.totalOutstanding) - parseFloat(bill.handlingFee)).toString();
            var temp = transactionData.dueDate.split('/');
            var year = temp[2];
            var month = temp[0];
            var day = temp[1];
            transactionData.dueDate = new Date(parseInt(year), parseInt(month), parseInt(day), 23, 59, 59);
            transactionData.handlingFee = req.body.handlingFee;
            transactionData.totalOutstanding = (parseFloat(transactionData.totalOutstanding) + parseFloat(transactionData.handlingFee)).toString();
            if(bill.authorizor)
            {
                transactionData.authorizor = bill.authorizor;
            }
            if(bill.payer)
            {
                transactionData.payer = bill.payer;
            }
            if(transactionData.authDate)
            {
                transactionData.authDate = bill.authDate;
            }
            axios.put("http://localhost:3000/api/Bill/"+ bill.billId.toString(), transactionData).then(function(response){
                //location.reload(); @Jawad I commented it, since it breaks element-hiding, but if neccessary i can uncomment it again and find another way to fix it.
                res.redirect("/ics/obills");
            }).catch(function(error){
                res.redirect("/ics/obillhist/"+bill.billId.toString());
            });
    });

}


function createFilter(oe) {
    if (oe != undefined){
        return FILTER.replace("#OE#", oe.oe);
    } else{
        return undefined;
    }
}
