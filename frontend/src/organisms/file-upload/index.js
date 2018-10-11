import React, { Component } from 'react'
import { connect } from 'react-redux'
import ipfs from '../../lib/ipfs'
import PriveosStore from '../../atoms/priveos-store'
import IpfsUpload from '../../molecules/ipfs-upload'


class FileUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      priveos: null,
      ipfsHash: null
    }

    this.onSelect = this.onSelect.bind(this)
    this.onStore = this.onStore.bind(this)
    this.onUpload = this.onUpload.bind(this)
    this.upload = this.upload.bind(this)
  }
  onSelect(evt) {
    const files = evt.target.files
    console.log('Selected File: ', files[0])
    this.setState({
      file: files[0]
    })
  }
  onStore(encryption) {
    console.log('got key and nonce', encryption.secret, encryption.nonce)
    this.setState({
      priveos: encryption
    })
  }
  upload() {
    const self = this
    ipfs.upload(this.state.file).then((files) => {
      console.log('resolved', files)
      self.setState({
        ipfsResponse: files[0]
      })
    })
  }

  onUpload(hash) {
    console.log('ipfsHash', hash)
    this.setState({
      ipfsHash: hash
    })
  }
  render() {
    let view = <PriveosStore onStore={this.onStore}/>
    if (this.state.priveos) {
      console.log('show ipfs upload')
      view = <IpfsUpload secret={this.state.priveos.secret} nonce={this.state.priveos.nonce} onUpload={this.onUpload}/>
    }
    

    return (
      <div>
        <div className="smallFont">Key: {this.state.priveos && this.state.priveos.secret}</div>
        <div className="smallFont">Nonce: {this.state.priveos && this.state.priveos.nonce}</div>
        <div className="smallFont">IPFS Hash: {this.state.ipfsHash}</div>
        <div className="smallFont">Node command: <pre>node decrypt.js {this.state.priveos && this.state.priveos.secret} {this.state.priveos && this.state.priveos.nonce} {this.state.ipfsHash}</pre></div>
        <br/><br/>
        {view}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(FileUpload);
