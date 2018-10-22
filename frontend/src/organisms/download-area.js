import React, { Component } from 'react'
import { connect } from 'react-redux'
import PurchaseButton from '../molecules/purchase-button'
import DownloadButton from '../molecules/download-button'


class DownloadFile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      purchased: false
    }
    this.getPurchasedFiles()
    this.getPurchasedFiles = this.getPurchasedFiles.bind(this)
  }
  
  getPurchasedFiles() {
    this.props.auth.eos.getPurchasedFiles(this.props.auth.account.name).then((res) => {
      console.log('get purchased files', res)
      this.setState({
        purchased: res.find((x) => x.id == this.props.file.id)
      })
    })
  }

  render() {
    if (!this.props.file) {
      return (
        <div></div>
      )
    }
    let view = <PurchaseButton file={this.props.file}/>
    if (this.state.purchased) {
      view = <DownloadButton file={this.props.file}/>
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
