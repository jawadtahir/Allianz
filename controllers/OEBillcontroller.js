const path = require('path');
const axios = require('axios');

exports.bill_list = function(req,res) {
    axios.get('http://localhost:3000/api/Bill')
        .then(response => {
            res.render(path.join(__dirname, "../public/pages/obills"), {
                bills: response.data
            });
        })
        .catch(error => {
            console.log(error);
        });
}