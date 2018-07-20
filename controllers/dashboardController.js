const axios = require('axios');
const path = require('path');
const BILL_API_ENDPOINT = 'http://localhost:3000/api/Bill';
const CLAIM_ENDPOINT = "http://localhost:30001/ics/claims";
const HOE_FILTER = '?filter={"where"%3A{"hoe"%3A"resource%3Ade.tum.allianz.ics.OE%23#OE#"}}';
const OOE_FILTER = "?filter=%7B%22where%22%3A%7B%22and%22%3A%5B%7B%22or%22%3A%5B%7B%22status%22%3A%22PENDING%22%7D%2C%7B%22status%22%3A%22SHOULDAUTH%22%7D%5D%7D%2C%7B%22ooe%22%3A%22resource%3Ade.tum.allianz.ics.OE%23#OE#%22%7D%5D%7D%7D";

exports.get_dashboard_data = async function (req, res) {
    var handling_count = 0;
    var owning_count = 0;
    var filter = createFilter(HOE_FILTER, app.get('USER'));
    if (filter != undefined){
        axios.get(BILL_API_ENDPOINT + filter).then(function (response) {
            handling_count = response.data.length;
            filter = createFilter(OOE_FILTER, app.get('USER'));
            axios.get(BILL_API_ENDPOINT + filter).then(function (response) {
                owning_count = response.data.length;
                res.render(path.join(__dirname, "../public/pages/index"), {
                    user: app.get('USER'),
                    owning_count: owning_count,
                    handling_count: handling_count
                });
            })
        });
    }
};

function createFilter(filter, oe) {
    if (oe != undefined){
        return filter.replace("#OE#", oe.oe);
    } else{
        return undefined;
    }
}
