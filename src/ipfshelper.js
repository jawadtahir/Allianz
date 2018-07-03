'use strict'
const ipfsAPI = require('ipfs-api')
ipfsApi = ipfsAPI('localhost', '5001')

function saveToIpfs (reader) {
    let ipfsId
    const buffer = Buffer.from(reader.result)
    this.ipfsApi.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response)
        ipfsId = response[0].hash
        console.log(ipfsId)
        //this.setState({added_file_hash: ipfsId})
        return ipfsId;
      }).catch((err) => {
        console.error(err)
      })
  }
