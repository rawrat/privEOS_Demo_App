import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { loadFiles } from '../action-creators/files'
import ReadableDate from '../atoms/readable-date'
import DownloadArea from '../organisms/download-area'


class File extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    console.log('Load uuid', this.props.match.params.uuid)
    this.props.loadFiles()
    this.getItem = this.getItem.bind(this)
  }

  getItem() {
    return this.props.files && this.props.files.items && this.props.files.items.find((x) => x.uuid == this.props.match.params.uuid)
  }

  render() {
    const item = this.getItem()
    if (!item) {
      return (
        <div>This file does not exist {this.props.match.params.uuid}</div>
      )
    }
    let downloadArea = (
      <div></div>
    )
    if (item.owner !== this.props.auth.account.name) {
      downloadArea = (
        <DownloadArea file={item}/>
      )
    }
    return (
      <div>
        <div className="row">
          <div className="col-md-2">UUID</div>
          <div className="col-md-10">{item.uuid}</div>
        </div>
        <div className="row">
          <div className="col-md-2">Name</div>
          <div className="col-md-10">{item.name}</div>
        </div>
        <div className="row">
          <div className="col-md-2">Description</div>
          <div className="col-md-10">{item.description}</div>
        </div>
        <div className="row">
          <div className="col-md-2">URL</div>
          <div className="col-md-10"><a href={item.url}>{item.url}</a></div>
        </div>
        <div className="row">
          <div className="col-md-2">Price</div>
          <div className="col-md-10">{item.price}</div>
        </div>
        <div className="row">
          <div className="col-md-2">Created at</div>
          <div className="col-md-10"><ReadableDate timestamp={item.created_at}/></div>
        </div>
        <div className="row">
          <div className="col-md-2">Owner</div>
          <div className="col-md-10">{item.owner}</div>
        </div>
        <br/><br/>
        {downloadArea}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(File))
