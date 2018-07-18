const path = require('path');
const driver = require('bigchaindb-driver');
const ipfsAPI = require('ipfs-api');
const config = app.get('config');
const ipfs = ipfsAPI('localhost', '5001');
const axios = require('axios');
const fs = require('fs');
const bip39 = require('bip39');
var hardcoded_ipfs_files; //We it them when config.dev_mode = TRUE!!
var bcdb_id_to_claim_id = {}; //To save time during production

exports.claims_list = function(req, res) {
	bcdb_conn = new driver.Connection(config.ROOT_URL);
	bcdb_id_to_claim_id = {};
	//Passing Res as a parameter is a crazy-hack, however I couldn't load all claims before launching page :/
	//Tried with await etc, but everytime failed about getting & parsing Data from IPFS.
	if(config.dev_mode) {
		hardcoded_ipfs_files = JSON.parse(fs.readFileSync('controllers/hardcoded_files.json').toString());
	}
	getData(req, res);
	//res.render(path.join(__dirname, "../public/pages/claims"));
};


exports.update_claims = function(req, res) {
	//console.log("BCDB_IDS are = " + bcdb_ids);
	var claims = req.body.claims;
	if(config.dev_mode) {
		markAsCreatedInDevMode(claims)
	} else {
		markAsCreatedInProduction(claims)
	}
}


function markAsCreatedInDevMode(claims) {
	for(var i=0; i < claims.length; i++) {
	  for( var j = 0; j < hardcoded_ipfs_files.length; j++) {
	    if(claims[i].ClaimId == hardcoded_ipfs_files[j].claim_id) {
		  hardcoded_ipfs_files[j].created = true;
	      }
      }
    }
   fs.writeFile('controllers/hardcoded_files.json', JSON.stringify(hardcoded_ipfs_files));
}


async function markAsCreatedInProduction(claims) {
	const bcdb_conn = new driver.Connection(config.ROOT_URL)
	const user = new driver.Ed25519Keypair(bip39.mnemonicToSeed("Secret").slice(0, 32));

	for(var i=0; i < claims.length; i++) {
		var id = bcdb_id_to_claim_id[claims[i].ClaimId]
		let get_data = bcdb_conn.getTransaction(id).then(data => updateAsset(bcdb_conn, user, data))
		await get_data
	}

}

function updateAsset(bcdb_connection, user, data) {
	const metadata = {'notcreated': 'status'}
	const txUpdateMetadata = driver.Transaction.makeTransferTransaction(
		[{ tx:data, output_index: 0}],
		[driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(user.publicKey))],
		{'created': 'status'}
	);
	signedMetadataUpdate = driver.Transaction.signTransaction(txUpdateMetadata, user.privateKey)
	bcdb_connection.postTransactionCommit(signedMetadataUpdate).then(output => console.log(output))
}

function getData(req, res) {
	bcdb_conn = new driver.Connection(config.ROOT_URL);
	bcdb_conn.searchMetadata(config.bcdb_metadata_term)
        .then(assets => extractFileHashesFromAssets(assets, req, res));
}

async function extractFileHashesFromAssets(assets_arr, req, res) {
	if(config.dev_mode) {
		getDummyIPFSData(res, req)
	}
	else {
		var file_hashes = [];
		for(var i=0; i < assets_arr.length; i++) {
			let get_ipfs = bcdb_conn.getTransaction(assets_arr[i].id)
				.then(transaction => mapData(file_hashes, assets_arr[i].id, transaction))
			await get_ipfs;
		}
		getIpfsData(file_hashes, req, res)
	}
}

function printTransactionDetails(transaction) {

	console.log("--------------------")
	console.log(transaction)
	console.log(transaction.metadata)
	if(transaction.metadata.hasOwnProperty("notcreated")) {
		console.log(transaction.asset.data.data)
	}
	console.log("--------------------")
}


function mapData(file_hashes, transaction_id, transaction) {
	//printTransactionDetails(transaction)
	if(!transaction.metadata.hasOwnProperty("notcreated")) {
		reduce(file_hashes, bcdb_id_to_claim_id, transaction.asset.id)
		return
	}
	var ipfs_file_hash = transaction.asset.data.data.ipfs_file_hash
	file_hashes.push(ipfs_file_hash)
	bcdb_id_to_claim_id[ipfs_file_hash] = transaction_id
}

function reduce(file_hashes, bcdb_id_to_claim_id, transaction_id) {
	var index = 0;
	for(var key in bcdb_id_to_claim_id) {
		if(bcdb_id_to_claim_id[key] == transaction_id) {
			delete bcdb_id_to_claim_id[key]
			file_hashes.splice(index, 1);
			return
		}
		index = index + 1;
	}
}

function updateMap(claim_id, ipfs_file_hash) { //Probably there is a better way to do this but I am so sleepy
	var transaction_id = bcdb_id_to_claim_id[ipfs_file_hash]
	delete bcdb_id_to_claim_id[ipfs_file_hash]
	bcdb_id_to_claim_id[claim_id] = transaction_id;
}


function getDummyIPFSData(res, req) {
	var claims = [];
	for(var i=0; i < hardcoded_ipfs_files.length; i++) {
		if(hardcoded_ipfs_files[i].hoe == req.session.user.oe && !hardcoded_ipfs_files[i].created) {
			claims.push(hardcoded_ipfs_files[i])
		}
	}
	res.render(path.join(__dirname, "../public/pages/claims"), {
		claims: claims, 
		user:app.get('USER')
	});
}
	


//I know its totaly agains async nature of Node.js, but couldn't find a better way and also don't want to block anyone.
//Lets use as that, but if I find a better way I will upload that definetly.
async function getIpfsData(ipfs_file_hashes, req, res) {
	var claims = [];
	var num_of_files = ipfs_file_hashes.length;


	for(var i=0 ; i < ipfs_file_hashes.length; i++) {
		let get_func = ipfs.files.get(ipfs_file_hashes[i], function (err, files) {
			files.forEach((file) => {
				var fp_copy = file.path // Idont know why I have to copy it otherwise I got undefined value as always after JSON.parse
				var file = JSON.parse(file.content.toString('utf8'))
				updateMap(file.claim_id, fp_copy)
				file.ipfs_location = fp_copy;
				if(file.hoe == req.session.user.oe) {
					claims.push(file);
				}
				num_of_files = num_of_files - 1;
				if(num_of_files == 0) {
					res.render(path.join(__dirname, "../public/pages/claims"), {
						claims: claims,
						user:app.get('USER')
					});
				}
		  	})
		})
		await get_func
	}
}
