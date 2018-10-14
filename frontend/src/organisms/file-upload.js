import React, { Component } from 'react'
import { connect } from 'react-redux'
import ipfs from '../lib/ipfs'
import IpfsUpload from '../molecules/ipfs-upload'
import { Link, withRouter } from 'react-router-dom'
import { priveos, generateUuid } from '../lib/priveos'
import config from '../config'


class FileUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      priveos: null,
      ipfsHash: null,
      secret: null,
      nonce: null,
      uuid: null
    }

    this.onSelect = this.onSelect.bind(this)
    this.onStore = this.onStore.bind(this)
    this.onUpload = this.onUpload.bind(this)
    this.upload = this.upload.bind(this)
    this.generateSecret = this.generateSecret.bind(this)

    this.generateSecret()
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


  generateSecret() {
    const self = this
    const uuid = generateUuid()
    console.log('uuid', uuid)
    priveos.store(config.owner, uuid).then((x) => {
      console.log(x)
      console.log('Successfully create upload transaction', x)
      self.setState({
        uuid: uuid,
        secret: x[0],
        nonce: x[1]
      })
    })
  }

  generateUuid() {
    return
  }

  onUpload(hash) {
    console.log('ipfsHash', hash)
    this.setState({
      ipfsHash: hash
    })
  }
  render() {
    

    return (
      <div>
        <div className="smallFont">Key: {this.state.secret}</div>
        <div className="smallFont">Nonce: {this.state.nonce}</div>
        <div className="smallFont">IPFS Hash: {this.state.ipfsHash}</div>
        <br/><br/>
        <IpfsUpload secret={this.state.secret} nonce={this.state.nonce} onUpload={this.onUpload}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FileUpload))
