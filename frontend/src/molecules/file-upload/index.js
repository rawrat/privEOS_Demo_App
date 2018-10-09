import React, { Component } from 'react'
import { connect } from 'react-redux'
import FileSelector from '../../atoms/file-selector'
import ipfs from '../../lib/ipfs'


class FileUpload extends Component {
  upload() {
    ipfs.upload()
  }
  render() {
    return (
      <div>
        <FileSelector/>
        <button onClick={this.upload}>Upload</button>
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
