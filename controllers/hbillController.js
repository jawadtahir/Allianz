const path = require('path');
const axios = require('axios');
const BILL_API_ENDPOINT = 'http://localhost:3000/api/Bill';
const FILTER = '?filter={"where"%3A{"hoe"%3A"resource%3Ade.tum.allianz.ics.OE%23#OE#"}}';

exports.OEhbillList = function(req,res) {
    var filter = creatFilterQuery(app.get('USER').oe);
    axios.get(BILL_API_ENDPOINT + filter)
        .then(response => {
            res.render(path.join(__dirname, "../public/pages/hbills"), {
                hbills: response.data,
                user:app.get('USER')
            });
        })
        .catch(error => {
            console.log(error);
        });

}

function creatFilterQuery(oe){
    return FILTER.replace('#OE#', oe);
}