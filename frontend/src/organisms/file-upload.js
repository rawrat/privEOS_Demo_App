import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUrl } from '../lib/ipfs'
import IpfsUpload from '../molecules/ipfs-upload'
import { withRouter } from 'react-router-dom'
import { getPriveos, generateUuid } from '../lib/eos'
//import { upload, login } from '../lib/eos'
import config from '../config'
import { Redirect } from 'react-router-dom'


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
      isReadyForTransaction: false,
      finished: false,
      fileDetailPath: null
    }

    this.onStore = this.onStore.bind(this)
    this.afterUpload = this.afterUpload.bind(this)
    this.upload = this.upload.bind(this)
    this.generateSecret = this.generateSecret.bind(this)
    this.setReadyness = this.setReadyness.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.generateSecret()
  }

  onKeyUp(evt) {
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
    const self = this
    // this.props.auth.eos.login(config.key)
    // console.log(JSON.stringify(this.state, null, 2))
    this.props.auth.eos.upload(this.props.auth.user, this.state.uuid, this.state.name, this.state.description, this.state.url, this.state.price).then((res) => {
      console.log('upload transaction success', res)
        self.setState({
          finished: true,
          fileDetailPath: '/files/' + self.state.uuid
        })
    })
  }

  setReadyness() {
    const isReadyForTransaction = this.state.uuid && this.state.name && this.state.description && this.state.url && this.state.price || false
    this.setState({
      isReadyForTransaction
    })
  }

  generateSecret() {
    const self = this
    const uuid = generateUuid()
    console.log('uuid', uuid)
    getPriveos().store(this.props.auth.user, uuid).then((x) => {
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
    if (this.state.finished) {
      return (
        <Redirect to={this.state.fileDetailPath}/>
      )
    }
    return (
      <div>
        <div className="form-group">
          <label htmlFor="name">Filename:</label>
          <input onKeyUp={this.onKeyUp} id="name" name="name" placeholder="Enter Name..." className="form-control"/>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea onKeyUp={this.onKeyUp} id="description" name="description" placeholder="Enter Description..." className="form-control"></textarea> 
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input onKeyUp={this.onKeyUp} name="price" id="price" placeholder="Enter Price in Format '1.0000 EOS'" className="form-control"/>
        </div>
        <IpfsUpload secret={this.state.secret} nonce={this.state.nonce} afterUpload={this.afterUpload}/>
        <br/>
        <button onClick={this.upload} disabled={!this.state.isReadyForTransaction} className="form-control btn btn-primary">Upload</button>
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
