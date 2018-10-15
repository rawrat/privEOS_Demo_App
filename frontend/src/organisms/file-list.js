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
    this.selectFile = this.selectFile.bind(this)
    this.getTrProps = this.getTrProps.bind(this)
  }

  selectFile(row) {
    console.log('selectFile', row)
    this.props.history.push('/files/' + row.original.uuid)
  }

  getTrProps(state, rowInfo, column, instance) {
    return {
      onClick: () => this.selectFile(rowInfo)
    }
  }

  render() {
    return (
      <div>
        <LoadingBar loading={this.props.files.loading}/>
        Loaded Files: {this.props.files.items.length}
        <br/><br/>
        <ReactTable data={this.props.files.items} columns={columns} getTrProps={this.getTrProps}/>
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
