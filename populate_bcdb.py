#!/usr/bin/python3
from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair


#tokens = {}
#tokens['app_id'] = 'YOUR_APP_ID'
#tokens['app_key'] = 'YOUR_APP_KEY'
bdb_root_url= 'http://localhost:9984/'
#bdb = BigchainDB('https://test.bigchaindb.com', headers=tokens)

bdb = BigchainDB(bdb_root_url)
alice = generate_keypair()
claim_1 = {'data': {'ipfs_file_hash': 'QmTtVrUR41AoSWYtbnow53X3fmyBMoKj7Gs6ekLQZ5e4Cf'},}
claim_2 = {'data': {'ipfs_file_hash': 'QmPLDZM9kV9A1RdRuPVQHqpeok5paEx7k9S14STZfjZBfg'},}
claim_3 = {'data': {'ipfs_file_hash': 'QmeA9r15SDjPtLuu5cpHT3YD6XPHrjiNZiMgzBieeoMAJ8'},}
claim_4 = {'data': {'ipfs_file_hash': 'QmQGqFFauYC7Vi7axpxZrGXUzvKtPjpATj1Gy4395fBVye'},}
claim_5 = {'data': {'ipfs_file_hash': 'QmZoEfFdnXMRNnRfq7KTxuh3TnfoV3eTWNmGAQUyzgtmgq'},}
claim_6 = {'data': {'ipfs_file_hash': 'QmeEMGyyX94Krwj6nqgtk891VfeoDk4aQassHRggWp2nKE'},}
claim_7 = {'data': {'ipfs_file_hash': 'QmQACrt9PGVwgG2g7Qttf4FaQcnEv6pAWtuP2ztYf569jZ'},}


claims = [claim_1, claim_2, claim_3, claim_4, claim_5, claim_6, claim_7]
print(alice)
metadata ={'bill-created' : 'no'}
for claim in claims:
	prepared_creation_tx = bdb.transactions.prepare(
		operation='CREATE',
		signers=alice.public_key,
		asset=claim,
		metadata=metadata
	)
	fulfilled_creation_tx = bdb.transactions.fulfill(prepared_creation_tx, private_keys=alice.private_key)
	print("Inserting Claim {}".format(claim));
	bdb.transactions.send_commit(fulfilled_creation_tx)
