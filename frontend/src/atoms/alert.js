import React, { Component } from 'react';

class Alert extends Component {
  render() {
    if (this.props.error) {
      return (
        <span className="alert alert-danger">{this.props.error.msg}</span>
      )
    } else {
      return (
        <span></span>
      )
    }
  }
}

export default Alert;
