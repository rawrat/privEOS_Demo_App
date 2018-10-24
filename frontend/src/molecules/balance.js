import React, { Component } from 'react'
import { connect } from 'react-redux'


class Balance extends Component {
  render() {
    if (!this.props.auth || !this.props.auth.balance || !this.props.auth.balance.funds) {
      return (
        <span>Loading...</span>
      )
    }
    return (
      <span>Proceeds: {this.props.auth.balance.funds}</span>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Balance);
