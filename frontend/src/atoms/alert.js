import React, { Component } from 'react';

class Alert extends Component {
  constructor(props) {
    super(props)
    this.state = {
      display: true
    }
    this.scheduleHide = this.scheduleHide.bind(this)
    this.scheduleHide()
  }

  scheduleHide() {
    const self = this
    window.setTimeout(() => {
      self.setState({
        display: false
      })
    }, 7500)
  }
  render() {
    if (this.props.error && this.state.display == true) {
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
