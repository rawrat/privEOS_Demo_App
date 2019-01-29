import React, { Component } from 'react'
import Size from './size'

class SingleFileSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null
    }
    this.onDrop = this.onDrop.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }
  onDragOver(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  onDragEnter(e) {
    e.stopPropagation()
    e.preventDefault()
  }
  onDrop(e) {
    e.stopPropagation()
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    this.props.onSelect(file)
    this.setState({
      file
    })
  }
  onSelect(e) {
    this.props.onSelect(e.target.files[0])
  }
  render() {
    return (
      <div className="form-group">
        <label htmlFor="file">
          File
        </label>
        <label className="form-control" htmlFor="file" onDragEnter={this.onDragEnter} onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <i class="fas fa-file"></i> {(this.state.file) ? (
          <strong>{this.state.file.name} (<Size size={this.state.file.size}/>)</strong>
        ) : (<span>Click or drop file here..</span>)}
        </label>
        <input name="file" id="file" type="file" onChange={this.onSelect}  hidden/>
      </div>
    );
  }
}

export default SingleFileSelector;
