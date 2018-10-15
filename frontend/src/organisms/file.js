import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { loadFile } from '../action-creators/files'


class File extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    console.log('Load uuid', this.props.match)
    this.props.loadFile(this.props.match.params.uuid)
  }


  render() {
    return (
      <div>
        File Detail Page here...
        {this.props.files && this.props.files.item && this.props.files.item.uuid}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  loadFile: (uuid) => dispatch(loadFile(uuid))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(File))
