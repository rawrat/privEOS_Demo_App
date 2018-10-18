import React, { Component } from 'react'
import { connect } from 'react-redux'


class DownloadButton extends Component {
  constructor(props) {
    super(props)
    this.download = this.download.bind(this)
  }

  download() {

  }
  
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12"><button className="btn btn-success" onClick={this.download}>Download</button></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);
