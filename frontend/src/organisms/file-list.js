import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoadingBar from '../atoms/loading-bar'
import { withRouter } from 'react-router-dom'
import { loadFiles, purchase, download } from '../action-creators/files'
import ReactTable from "react-table"
import DownloadButton from '../molecules/download-button'
import PurchaseButton from '../molecules/purchase-button'


class FileList extends Component {
  constructor(props) {
    super(props)
    const self = this
    this.state = {}
    this.props.loadFiles()
    this.selectFile = this.selectFile.bind(this)
    this.getTrProps = this.getTrProps.bind(this)
    this.getColumns = this.getColumns.bind(this)
  }

  getColumns() {
    const self = this
    return [
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
      },
      {
        Header: "Download",
        id: 'download',
        Cell: row => {
          // console.log('cell render', JSON.stringify(row.original, null, 2))
          if (row.original.owning) {
            return (<span></span>)
          } else if (row.original.purchased) {
            return (<DownloadButton file={row.original} className='btn-sm'/>)
          } else {
            return (<PurchaseButton file={row.original} className='btn-sm'/>)
          }
        }
      }
    ]
  }

  selectFile(row) {
    this.props.history.push('/files/' + row.original.uuid)
  }

  getTrProps(state, rowInfo, column, instance) {
    return {
      onClick: () => this.selectFile(rowInfo)
    }
  }

  render() {
    // console.log('files in filelist', this.props.files)
    return (
      <div>
        <LoadingBar loading={this.props.files.loading}/>
        Loaded Files: {this.props.files.items.length}
        <br/><br/>
        <ReactTable data={this.props.files.items} columns={this.getColumns()} getTrProps={this.getTrProps}/>
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
