import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUrl } from '../lib/ipfs'
import IpfsUpload from '../molecules/ipfs-upload'
import { withRouter } from 'react-router-dom'
import { priveos, generateUuid, upload, login } from '../lib/eos'
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
      uuid: null,
      name: null,
      description: null,
      url: null,
      price: null,
      isReadyForTransaction: false
    }

    this.onSelect = this.onSelect.bind(this)
    this.onStore = this.onStore.bind(this)
    this.afterUpload = this.afterUpload.bind(this)
    this.upload = this.upload.bind(this)
    this.generateSecret = this.generateSecret.bind(this)
    this.setReadyness = this.setReadyness.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.generateSecret()
  }

  onSelect(evt) {
    const files = evt.target.files
    console.log('Selected File: ', files[0])
    this.setState({
      file: files[0]
    })
  }

  onKeyUp(evt) {
    console.log("onkeyup", evt, evt.target.name, evt.target.value)
    this.setState({
      [evt.target.name]: evt.target.value
    })
    this.setReadyness()
  }

  onStore(encryption) {
    console.log('got key and nonce', encryption.secret, encryption.nonce)
    this.setState({
      priveos: encryption
    })
  }

  upload() {
    login(config.key)
    upload(this.state.uuid, this.state.name, this.state.description, this.state.url, this.state.price).then((res) => {
      console.log('upload transaction success', res)
    })
  }

  setReadyness() {
    console.log(this.state.uuid, this.state.name, this.state.description, this.state.url, this.state.price)
    const isReadyForTransaction = this.state.uuid && this.state.name && this.state.description && this.state.url && this.state.price || false
    console.log('isReadyForTransaction', isReadyForTransaction)
    this.setState({
      isReadyForTransaction
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

  afterUpload(hash) {
    console.log('ipfsHash', hash)
    this.setState({
      ipfsHash: hash,
      url: getUrl(hash)
    })
    this.setReadyness()
  }

  render() {
    return (
      <div>
        <div className="smallFont">UUID: {this.state.uuid}</div>
        <div className="smallFont">Key: {this.state.secret}</div>
        <div className="smallFont">Nonce: {this.state.nonce}</div>
        <div className="smallFont">IPFS Hash: {this.state.ipfsHash}</div>
        <div className="smallFont">Upload URL: {this.state.url}</div>
        <br/><br/>
        <input onKeyUp={this.onKeyUp} name="name" placeholder="Enter Name..." className="form-control"/>
        <br/>
        <textarea onKeyUp={this.onKeyUp} name="description" placeholder="Enter Description..." className="form-control"></textarea> 
        <br/>
        <input onKeyUp={this.onKeyUp} name="price" placeholder="Enter Price in Format '1.0000 EOS'" className="form-control"/>
        <br/>
        <IpfsUpload secret={this.state.secret} nonce={this.state.nonce} afterUpload={this.afterUpload}/>
        <br/><br/>
        <button onClick={this.upload} disabled={!this.state.isReadyForTransaction}>Upload</button>
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
