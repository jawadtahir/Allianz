const path = require('path');
const axios = require('axios');
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

function getBills(authList, pendingList, req, res){
    var filter = createFilter(app.get("USER").oe);
    axios.get(BILL_API_ENDPOINT+filter).then(
        function (response){
            for (var i = 0; i < response.data.length; i++){
                var bill = response.data[i];
                bill.hoe = bill.hoe.split("#")[1];
                bill.dueDate = new Date(bill.dueDate).toLocaleDateString();
                if (bill.authorizor == undefined){
                    bill.authorizor = "";
                }else{
                    bill.authorizor = bill.authorizor.split("#")[1];
                }
                if (bill.status == "PENDING"){
                    pendingList.push(bill);
                }else{
                    authList.push(bill);
                }
            }
            res.render(path.join(__dirname, "../public/pages/obills"),{
                authList: authList,
                pendingList: pendingList,
                user: app.get("USER")
            });
        });
}

function createFilter(oe){
    return FILTER.replace("#OE#", oe);
}

function getAuthList(){}