import React, { Component } from 'react';

class FileDetails extends Component {
  render() {
    if (this.props.file) {
      return (
        <div>
          <span className="smallFont">{this.props.file.name} ({this.props.file.size} Bytes)</span>
        </div>
      )
    } else {
      return (
        <span></span>
      )
    }
  }
}

export default FileDetails;
