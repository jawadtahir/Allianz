const path = require('path');
const axios = require('axios');
var bodyParser = require('body-parser');




exports.get_login_page = function(req, res) {
	res.render(path.join(__dirname, "../public/pages/login"));
};

exports.login_request= function(req, res) {
	
	axios.get('http://localhost:3000/api/system/identities/'+ req.body.password).then(function(response) {
		if(response.data.name == req.body.username) {
			var id = response.data.participant.split("#")[1];
			create_session_with_user_credentials(id, req, res)
		} else {
			console.log("Incorrect Name");
		}
	}).catch(function(error) {
		console.log("Incorrect Identity ID :(");
	});
};




async function create_session_with_user_credentials(id, req, res) {
	axios.get('http://localhost:3000/api/User/'+id).then(function(response)
	{
		req.session.user=response.data;
		req.session.user.oe=req.session.user.oe.split("#")[1];
		app.set('USER', req.session.user);
		res.redirect("/ics/");
	}).catch(function(error) {
		console.log(error);
	});
}



