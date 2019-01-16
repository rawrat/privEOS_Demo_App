import React, { Component } from 'react';
import LoadingBar from './loading-bar'

class Alert extends Component {
  render() {
    return (
      <div className={"alert alert-" + this.props.alert.type}>
        { this.props.alert.loading ? (<LoadingBar />) : (<span></span>) }
        <b>{this.props.alert.name || ''}</b><br/>{this.props.alert.message}
      </div>
    )
  }
}

export default Alert;
