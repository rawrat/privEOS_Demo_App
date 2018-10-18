import React, { Component } from 'react';

class SingleFileSelector extends Component {
  constructor(props) {
    super(props)
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
    this.props.onSelect(e.dataTransfer.files[0])
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
          Click or drop file here...
        </label>
        <input name="file" id="file" type="file" onChange={this.onSelect}  hidden/>
      </div>
    );
  }
}

export default SingleFileSelector;
