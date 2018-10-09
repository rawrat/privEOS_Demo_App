import React, { Component } from 'react'
import { connect } from 'react-redux'
import SingleFileSelector from '../../atoms/single-file-selector'
import FileDetails from '../../atoms/file-details'
import ipfs from '../../lib/ipfs'


class FileUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null
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
    ipfs.upload(this.state.file).then((file) => {
      console.log('resolved', file)
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
