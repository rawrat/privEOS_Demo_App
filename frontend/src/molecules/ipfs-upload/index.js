import React, { Component } from 'react'
import { connect } from 'react-redux'
import SingleFileSelector from '../../atoms/single-file-selector'
import FileDetails from '../../atoms/file-details'
import IpfsLink from '../../atoms/ipfs-link'
import ipfs from '../../lib/ipfs'
import { encrypt, encodeHex } from '../../lib/crypto'
import { read } from '../../lib/file'


class IpfsUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      ipfsResponse: null
    }

    this.onSelect = this.onSelect.bind(this)
    this.upload = this.upload.bind(this)
  }
  onSelect(evt) {
    const files = evt.target.files
    console.log('Selected File: ', files[0])
    this.setState({
      file: files[0]
    })
  }
  encrypt(message) {
    console.log('encrypt before')
    console.log('secret', this.props.secret)
    console.log('nonce', this.props.nonce)
    return encrypt(message, this.props.nonce, this.props.secret)
  }
  upload() {
    const self = this

    read(this.state.file).then((content) => {
      const cipher = this.encrypt(content)
      console.log('cipher', cipher)
      ipfs.upload(cipher).then((file) => {
        console.log('resolved', file)
        self.setState({
          ipfsResponse: file
        })
        if (self.props.onUpload) {
          self.props.onUpload(file.name)
        }
      })
      .catch((err) => {
        console.error(err)
      })
    });
  }
  render() {
    return (
      <div>
        <SingleFileSelector onSelect={this.onSelect}/>
        <FileDetails file={this.state && this.state.file || null}/>
        <br/><br/>
        <div>
          <button onClick={this.upload} disabled={this.state.file ? false : true}>Upload</button>
        </div>
        <IpfsLink hash={this.state.ipfsResponse && this.state.ipfsResponse.hash || null}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(IpfsUpload);
