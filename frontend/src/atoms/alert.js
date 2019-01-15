import React, { Component } from 'react';

class Alert extends Component {
  render() {
    if (this.props.error) {
      return (
        <div className="alert alert-danger"><b>{this.props.error.name || ''}</b><br/>{this.props.error.message}</div>
      )
    } else {
      return (
        <span></span>
      )
    }
  }
}

export default Alert;
