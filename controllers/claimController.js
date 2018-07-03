const path = require('path');
const driver = require('bigchaindb-driver');
const ipfsAPI = require('ipfs-api')
const config = app.get('config')
const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
exports.claims_list = function(req, res) {
	bcdb_conn = new driver.Connection(config.ROOT_URL);
	//Passing Res as a parameter is a crazy-hack, however I couldn't load all claims before launching page :/
	//Tried with await etc, but everytime failed about getting & parsing Data from IPFS.
	getData(res);
	//res.render(path.join(__dirname, "../public/pages/claims"));
};

function getData(res) {
	console.log(config.bcdb_metadata_term);
	bcdb_conn = new driver.Connection(config.ROOT_URL);
	bcdb_conn.searchMetadata(config.bcdb_metadata_term)
        .then(assets => extractFileHashesFromAssets(assets ,res));
}

async function extractFileHashesFromAssets(assets_arr, res) {
	var file_hashes = [];
	for(var i=0; i < assets_arr.length; i++) {
		let get_ipfs = bcdb_conn.getTransaction(assets_arr[i].id)
			.then(transaction => file_hashes.push(transaction.asset.data.ipfs_file_hash));
		await get_ipfs;
	}
	getIpfsData(file_hashes, res)
}

//I know its totaly agains async nature of Node.js, but couldn't find a better way and also don't want to block anyone.
//Lets use as that, but if I find a better way I will upload that definetly.
function getIpfsData(ipfs_file_hashes, res) {
	var claims = [];
	var num_of_files = ipfs_file_hashes.length;
	for(var i=0; i< ipfs_file_hashes.length; i++) {
		ipfs.files.get(ipfs_file_hashes[i], function (err, files) {
		  files.forEach((file) => {
				var fp_copy = file.path // Idont know why I have to copy it otherwise I got undefined value as always after JSON.parse
				var file = JSON.parse(file.content.toString('utf8'))
				file.ipfs_location = fp_copy;
				claims.push(file);
				num_of_files = num_of_files - 1;
				console.log(num_of_files)
				if(num_of_files == 0) {
					console.log(claims)
					res.render(path.join(__dirname, "../public/pages/claims"), {
						claims: claims
					});
				}
		  })
		})
	}
}
