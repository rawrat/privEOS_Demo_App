import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { loadFiles } from '../action-creators/files'
import ReadableDate from '../atoms/readable-date'


class File extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    console.log('Load uuid', this.props.match.params.uuid)
    this.props.loadFiles()
    this.purchase = this.purchase.bind(this)
    this.getItem = this.getItem.bind(this)
  }

  purchase() {
    const item = this.getItem()
    this.props.auth.eos.buy(this.props.auth.user, item.price, item.uuid)
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
          <div className="col-md-10">{item.url}</div>
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
        <div className="row">
          <div className="col-md-12"><button className="btn btn-success" onClick={this.purchase}>Download for {item.price}</button></div>
        </div>
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
