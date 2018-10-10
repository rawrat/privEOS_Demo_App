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
    let view = <PriveosStore/>
    if (this.state.priveos) {
      console.log('show ipfs upload')
      view = <IpfsUpload/>
    }
    

    return (
      <div>
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
