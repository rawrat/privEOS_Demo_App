import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getPriveos, generateUuid } from '../lib/eos'

import SingleFileSelector from '../atoms/single-file-selector'
import FileDetails from '../atoms/file-details'
import { upload } from '../action-creators/files'


class FileUpload extends Component {
  constructor(props) {
    super(props)

    const { secret_bytes, nonce_bytes } = getPriveos().get_encryption_keys()
    const uuid = generateUuid()

    this.state = {
      file: null,
      priveos: null,
      secret_bytes,
      nonce_bytes,
      uuid,
      name: null,
      description: null,
      price: '1.0000 EOS',
      isReadyForTransaction: false,
    }

    this.upload = this.upload.bind(this)
    this.setReadyness = this.setReadyness.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  onKeyUp(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
    this.setReadyness()
  }

  setReadyness() {
    console.log('Object', {
      uuid: this.state.uuid,
      name: this.state.name,
      description: this.state.description,
      file: this.state.file,
      price: this.state.price
    })
    const isReadyForTransaction = this.state.uuid && this.state.name && this.state.description && this.state.file && this.state.price || false
    this.setState({
      isReadyForTransaction
    })
  }

  upload() {
    this.props.upload(this.state.uuid, this.state.name, this.state.description, this.state.price, this.state.file, this.state.secret_bytes, this.state.nonce_bytes)
  }

  onSelect(file) {
    console.log('Selected File: ', file)
    this.setState({
      file
    })
    window.setTimeout(this.setReadyness, 0)
  }

  render() {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="name">Filename:</label>
          <input onKeyUp={this.onKeyUp} id="name" name="name" placeholder="Enter Name..." className="form-control" autoComplete="off"/>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea onKeyUp={this.onKeyUp} id="description" name="description" placeholder="Enter Description..." className="form-control"></textarea> 
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input onKeyDown={this.onKeyUp} name="price" id="price" className="form-control" defaultValue={this.state.price} />
        </div>
        <SingleFileSelector onSelect={this.onSelect}/>
        <FileDetails file={this.state && this.state.file || null}/>
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
  upload: (uuid, name, description, price, file, secret_bytes, nonce_bytes) => dispatch(upload(uuid, name, description, price, file, secret_bytes, nonce_bytes))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FileUpload))
