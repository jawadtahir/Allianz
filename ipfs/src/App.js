'use strict'
const React = require('react')
const ipfsAPI = require('ipfs-api')

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      added_file_hash: null
    }
    this.ipfsApi = ipfsAPI('localhost', '5001')
    
    // bind methods
    this.captureFile = this.captureFile.bind(this)
    this.saveToIpfs = this.saveToIpfs.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.retrieve = this.retrieve.bind(this)
    this.getFile = this.getFile.bind(this)
  }

  captureFile (event) {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.onloadend = () => this.saveToIpfs(reader)
    reader.readAsArrayBuffer(file)
  }

  getFile(stream,validCID){
      
      stream = this.ipfsApi.cat('https://ipfs.io/ipfs/'+validCID).then((response) => {
      console.log(response)
     }).catch((err) => {
        console.error(err)})
        return
  }

  retrieve(event){  
    const validCID = event.target.value  
    //var fileDownload = require('react-file-download')    
    //var Bufferfile = require('buffer/').Buffer
    //stream.onloadend=() =>this.getFile(stream,validCID)
    //let Bufferfile
    /*this.ipfsApi.files.cat('QmXBpD37vBm5537pqHwyJRGSaX7hMrkHyp866wqEVU2BE8',function(err,Bufferfile){
      if(err){
        throw err
      }     
    })
    fileDownload(Bufferfile,validCID)*/
    this.setState({added_file_hash: event.target.value})
  }

  saveToIpfs (reader) {
    let ipfsId
    const buffer = Buffer.from(reader.result)
    this.ipfsApi.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response)
        ipfsId = response[0].hash
        console.log(ipfsId)
        this.setState({added_file_hash: ipfsId})
      }).catch((err) => {
        console.error(err)
      })
  }

  handleSubmit (event) {
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <form id='captureMedia' onSubmit={this.handleSubmit}>
          <input type='file' onChange={this.captureFile} />
        </form>
        <form id='retriveMedia' onSubmit={this.handleSubmit}>
          <input type='text' onChange={this.retrieve} />
          <input type="submit" value="submit"/>
        </form>

        <div>
          <a target='_blank'
            href={'https://ipfs.io/ipfs/' + this.state.added_file_hash}>
            {this.state.added_file_hash}
          </a>
        </div>
      </div>
    )
  }
}
module.exports = App