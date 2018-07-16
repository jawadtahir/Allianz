const path = require('path');
const axios = require('axios');

exports.bill_list = function(req,res) {
    axios.get('http://localhost:3000/api/Bill?filter=%7B%22where%22%3A%20%7B%22status%22%3A%20%22PENDING%22%7D%7D')
        .then(response => {
            res.render(path.join(__dirname, "../public/pages/obills"), {
                bills: response.data
            });
        })
        .catch(error => {
            console.log(error);
        });
}