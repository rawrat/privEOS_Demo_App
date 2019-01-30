import React, { Component } from 'react'
import { connect } from 'react-redux'
import { download } from '../action-creators/files'
import LoadingBar from '../atoms/loading-bar'


class DownloadButton extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            {(this.props.files.downloading.find((x) => x == this.props.file.id) !== undefined) ? (
              <LoadingBar/>
            ) : (
              <button className={`btn btn-success ${this.props.className}`} onClick={(e) => { e.stopPropagation(); this.props.download(this.props.file)}}>Download</button>
            )}
        </div>
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
