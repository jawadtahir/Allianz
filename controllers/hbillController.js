const path = require('path');
const axios = require('axios');


exports.OEhbillList = function(req,res) {
    axios.get('http://localhost:3000/api/de.tum.allianz.ics.Bill?filter={"where"%3A{"hoe"%3A"resource%3Ade.tum.allianz.ics.OE%23GR"}}')
        .then(response => {
            res.render(path.join(__dirname, "../public/pages/hbills"), {
                hbills: response.data
            });
        })
        .catch(error => {
            console.log(error);
        });
}