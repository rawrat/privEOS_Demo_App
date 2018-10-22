import React, { Component } from 'react'
import { connect } from 'react-redux'
import { download } from '../action-creators/files'


class DownloadButton extends Component {
  render() {
    console.log('downloading', this.props.files)
    return (
      <div>
        <div className="row">
          <div className="col-md-12"><button className="btn btn-success" onClick={() => this.props.download(this.props.file)} disabled={this.props.files.downloading && this.props.files.downloading.find((x) => this.props.file.id)}>Download</button></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  download: (file) => dispatch(download(file))
})

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);
