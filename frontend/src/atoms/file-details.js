import React, { Component } from 'react';

class FileDetails extends Component {
  render() {
    if (this.props.file) {
      return (
        <span className="smallFont">({this.props.file.size} Bytes)</span>
      )
    } else {
      return (
        <span></span>
      )
    }
  }
}

export default FileDetails;
