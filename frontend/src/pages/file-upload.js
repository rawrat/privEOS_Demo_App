import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getPriveos, generateUuid } from '../lib/eos'

import SingleFileSelector from '../atoms/single-file-selector'
import { upload } from '../action-creators/files'


class FileUpload extends Component {
  constructor(props) {
    super(props)

    const { key, nonce } = getPriveos().get_encryption_keys()
    const uuid = generateUuid()

    this.state = {
      file: null,
      priveos: null,
      secret_bytes: key,
      nonce_bytes: nonce,
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
    let value = evt.target.value
    if (evt.target.name == 'price') {
      const parts = value.split(' ')
      value = `${parseFloat(parts[0]).toFixed(4)} ${parts[1]}`
    }
    this.setState({
      [evt.target.name]: value
    })
    this.setReadyness()
  }

  setReadyness() {
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
    let newState = {
      file
    }
    if (!this.state.name) {
      newState.name = file.name
    }
    this.setState(newState)
    window.setTimeout(this.setReadyness, 0)
  }

  render() {
    return (
      <div>
        <SingleFileSelector onSelect={this.onSelect}/>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input onKeyUp={this.onKeyUp} onChange={this.onKeyUp} defaultValue={this.state.name} id="name" name="name" placeholder="Enter Name..." className="form-control" autoComplete="off"/>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea onKeyUp={this.onKeyUp} onChange={this.onKeyUp} id="description" name="description" placeholder="Enter Description..." className="form-control"></textarea> 
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input onKeyUp={this.onKeyUp} onChange={this.onKeyUp} name="price" id="price" className="form-control" defaultValue={this.state.price} />
        </div>
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
