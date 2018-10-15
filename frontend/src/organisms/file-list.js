import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoadingBar from '../atoms/loading-bar'
import { withRouter } from 'react-router-dom'
import { loadFiles, loadFilesSuccess, loadFilesError } from '../action-creators/files'
import ReactTable from "react-table";

const columns = [
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Description",
    accessor: "description"
  },
  {
    Header: "Owner",
    accessor: "owner"
  },
  {
    Header: "Price",
    accessor: "price"
  },
  {
    Header: "URL",
    accessor: "url"
  }
]

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
        Loaded Files: {this.props.files.items.length}
        <br/><br/>
        <ReactTable data={this.props.files.items} columns={columns}/>
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
