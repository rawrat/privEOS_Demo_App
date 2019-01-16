import React, { Component } from 'react'
import { connect } from 'react-redux'
import PurchaseButton from './purchase-button'
import DownloadButton from './download-button'


class DownloadFile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let view = <div></div>
    if (this.props.file && this.props.file.purchased) {
        view = <DownloadButton file={this.props.file}/>
    } else if (this.props.file && !this.props.file.purchased) {
      view = <PurchaseButton file={this.props.file}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(DownloadFile);
