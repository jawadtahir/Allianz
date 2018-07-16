const path = require('path');
const axios = require('axios');
var bodyParser = require('body-parser');

exports.get_login_page = function(req, res) {
	res.render(path.join(__dirname, "../public/pages/login"));
	res.sendFile(__dirname + '/public/pages/login');
};

exports.login_request= function(req, res) {
	console.log(req.body.username);
	axios.get('http://localhost:3000/api/system/identities').then(function(response)
	{
		for(var i=0; i < response.data.length; i++) {
			//console.log(req.body.username)
			//console.log(response.data[i].name)
			if(req.body.username == response.data[i].name) {
				//console.log("Name is = " + response.data[i].name);
				//console.log("Participant is = " + response.data[i].participant);
				var id = response.data[i].participant.split('#')[1];
				//console.log("ID is =  "+ id);
				//console.log("--------------");
				create_session_with_user_credentials(id, req, res)
				break;
			}
		}
	}).catch(function(error){
		console.log(error);
	});
};


async function create_session_with_user_credentials(id, req, res) {
	//console.log("ID is = " + id);
	//var address = "http://localhost:3000/api/User/" + id
	//console.log(address)
	axios.get('http://localhost:3000/api/User/'+id).then(function(response)
	{
		
		//console.log("Create Session Part! " + id);
		//console.log("----------------");
		//console.log(response.data);
		req.session.user=response.data;
		console.log(req.session.user);
		res.render(path.join(__dirname, "../public/pages/index",));
		//console.log("----------------");
		//Set Session in here!
	}).catch(function(error) {
		console.log(error);
	});
}



