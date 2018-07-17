const path = require('path');
const axios = require('axios');
var bodyParser = require('body-parser');

exports.get_login_page = function(req, res) {
	res.render(path.join(__dirname, "../public/pages/login"));
};

exports.login_request= function(req, res) {
	axios.get('http://localhost:3000/api/system/identities').then(function(response)
	{
		for(var i=0; i < response.data.length; i++) {
			
			if(req.body.username == response.data[i].name) {
				
				var id = response.data[i].participant.split('#')[1];
				create_session_with_user_credentials(id, req, res)
				break;
			}
		}
	}).catch(function(error){
		console.log(error);
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



