const BusinessNetworkDefinition = require('composer-client');

const path = require('path');
const axios = require('axios');
const BILL_API_ENDPOINT = 'http://localhost:3000/api/Bill';
const FILTER = '?filter={"where"%3A{"hoe"%3A"resource%3Ade.tum.allianz.ics.OE%23#OE#"}}';

exports.OEhbillList = function(req,res) {
    var filter = creatFilterQuery(app.get('USER'));
    if (filter != undefined){
        var hbills = [];
        axios.get(BILL_API_ENDPOINT + filter)
        .then(response => {
            hbills = response.data;
            for(var i = 0; i < hbills.length;i++){
                var date = hbills[i].dueDate.toString().split(':')
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
                hbills[i].dueDate = day + '/' + month + '/' + year + ' ' + hour + ':' + min;
                hbills[i].ooe = hbills[i].ooe.split('#')[1];
            }
            res.render(path.join(__dirname, "../public/pages/hbills"), {
                hbills: hbills,
                user:app.get('USER'),
            });
        })
        .catch(error => {
            console.log(error);
        });
    }
}

function creatFilterQuery(oe) {
    if (oe != undefined){
        return FILTER.replace("#OE#", oe.oe);
    } else{
        return undefined;
    }
}
