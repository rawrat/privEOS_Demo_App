import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUrl } from '../lib/ipfs'
import IpfsUpload from '../molecules/ipfs-upload'
import { withRouter } from 'react-router-dom'
import { priveos, generateUuid, upload, login } from '../lib/eos'
import config from '../config'


class FileList extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div>
        Filelist
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FileList))
