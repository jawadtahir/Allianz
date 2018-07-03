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
claim_1 = {'data': {'ipfs_file_hash': 'QmRRKg7vw1zDyNos29dUB3YNem1c3WVLFFbAbtpty5AnqY'},}
claim_2 = {'data': {'ipfs_file_hash': 'QmNunE3njVPRzDQRmgrX5FBKCTuxFvSiXVXcG2qj2frUaq'},}
claim_3 = {'data': {'ipfs_file_hash': 'QmaQ5MKCSpz9jaKrtQzpLBzUzmrv7BFKDYRfRg8ZEmob4B'},}
claim_4 = {'data': {'ipfs_file_hash': 'QmbytFc55UB1B1Egs33t1FvwmRmhsjttRpmGE6Yp97MiMh'},}
claim_5 = {'data': {'ipfs_file_hash': 'QmX6RkEgF4RfsfiaDZLHFJQNoTSCgFGru2aW5UJYGx7RSu'},}
# Until implementing login-logout functionality, It is okay to keep all ooe's as altest

claims = [claim_1, claim_2, claim_3, claim_4, claim_5]
metadata ={'project-name' : 'ipfs'}
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
