#!/usr/bin/python3
from bigchaindb_driver import BigchainDB

#tokens = {}
#tokens['app_id'] = 'YOUR_APP_ID'
#tokens['app_key'] = 'YOUR_APP_KEY'
#bdb = BigchainDB('https://test.bigchaindb.com', headers=tokens)
bdb_root_url= 'http://localhost:9984/'
bdb = BigchainDB(bdb_root_url)
print("Results --------");
claims_list = bdb.metadata.get(search='ipfs');
for claim in claims_list:
	print("-----");
	print(claim['id']);
	claim_ret = bdb.transactions.get(asset_id=claim['id'])
	print(claim_ret)
