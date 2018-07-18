const driver = require('bigchaindb-driver')
const bip39 = require('bip39');
const bdb_root_url= 'http://localhost:9984/api/v1/'
const alice = new driver.Ed25519Keypair(bip39.mnemonicToSeed("Secret").slice(0, 32));
const bob = new driver.Ed25519Keypair()
const conn = new driver.Connection(bdb_root_url)

claims = [
 { 'data': { 'ipfs_file_hash': 'QmTtVrUR41AoSWYtbnow53X3fmyBMoKj7Gs6ekLQZ5e4Cf'}},
 { 'data': { 'ipfs_file_hash': 'QmPLDZM9kV9A1RdRuPVQHqpeok5paEx7k9S14STZfjZBfg'}},
 { 'data': { 'ipfs_file_hash': 'QmeA9r15SDjPtLuu5cpHT3YD6XPHrjiNZiMgzBieeoMAJ8'}},
 { 'data': { 'ipfs_file_hash': 'QmQGqFFauYC7Vi7axpxZrGXUzvKtPjpATj1Gy4395fBVye'}},
 { 'data': { 'ipfs_file_hash': "QmZoEfFdnXMRNnRfq7KTxuh3TnfoV3eTWNmGAQUyzgtmgq"}},
 { 'data': { 'ipfs_file_hash': "Qmbf3UgNJTQdnXGzAXyqh5QxoPQihQuxrV9JT7o9qsdLG3"}},
 { 'data': { 'ipfs_file_hash': "QmeS8QPsE3HJpGoN8Evmn2GwbNoqjqUyKXKwdPY7ZRPeaF"}}];



const metadata = {'notcreated': 'status'}
for(var i=0; i < claims.length; i++) {
	console.log(claims[i])
	const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
        claims[i],
        metadata,
        // A transaction needs an output
        [ driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(alice.publicKey))
        ],
        alice.publicKey
)
const txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, alice.privateKey)
conn.postTransactionCommit(txCreateAliceSimpleSigned)

}


