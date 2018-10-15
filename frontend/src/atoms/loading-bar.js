import React, { Component } from 'react';

class LoadingBar extends Component {
  render() {
    console.log('render loading bar', this.props.loading)
    if (this.props.loading) {
      return (
        <span className="smallFont">Loading...</span>
      )
    } else {
      return (
        <span></span>
      )
    }
  }
}

export default LoadingBar;
