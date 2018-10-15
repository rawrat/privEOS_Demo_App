import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoadingBar from '../atoms/loading-bar'
import { withRouter } from 'react-router-dom'
import { loadFiles, loadFilesSuccess, loadFilesError } from '../action-creators/files'


class FileList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.props.loadFiles()
  }

  render() {
    return (
      <div>
        <LoadingBar loading={this.props.files.loading}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  loadFiles: () => dispatch(loadFiles())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FileList))
