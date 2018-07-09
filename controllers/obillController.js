const path = require('path');
const axios = require('axios');
const FILTER = "?filter=%7B%22where%22%3A%7B%22or%22%3A%5B%7B%22status%22%3A%22PENDING%22%7D%2C%7B%22status%22%3A%22SHOULDAUTH%22%7D%5D%7D%7D";




exports.obills = async function (req, res) {
    var authList = [];
    var pendingList = [];
    getBills(authList, pendingList, res);
};

function getBills(authList, pendingList, res){
    axios.get('http://localhost:3000/api/Bill'+FILTER).then(
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
                pendingList: pendingList
            });
        });
}

function getPendingList(){

}

function getAuthList(){}