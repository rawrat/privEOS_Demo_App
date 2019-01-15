import React, { Component } from 'react';

class Alert extends Component {
  render() {
    return (
      <div className={"alert alert-" + this.props.alert.type}><b>{this.props.alert.name || ''}</b><br/>{this.props.alert.message}</div>
    )
  }
}

export default Alert;
