import React, { Component } from 'react';

class LoadingBar extends Component {
  render() {
    if (typeof(this.props.loading) == "undefined" || this.props.loading == true) {
      return (
        <span className="smallFont imagePaddingRight"><img src="/img/loading.gif"/></span>
      )
    } else {
      return (
        <span></span>
      )
    }
  }
}

export default LoadingBar;
