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
            res.render(path.join(__dirname, "../public/pages/hbills"), {
                hbills: hbills,
                user:app.get('USER')
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
