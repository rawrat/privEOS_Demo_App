import React, { Component } from 'react'
import { connect } from 'react-redux'
import SingleFileSelector from '../../atoms/single-file-selector'
import FileDetails from '../../atoms/file-details'
import IpfsLink from '../../atoms/ipfs-link'
import ipfs from '../../lib/ipfs'


class IpfsUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      priveos: null,
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
  upload() {
    const self = this
    ipfs.upload(this.state.file).then((files) => {
      console.log('resolved', files)
      self.setState({
        ipfsResponse: files[0]
      })
    })
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
