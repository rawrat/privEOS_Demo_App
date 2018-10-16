import React, { Component } from 'react'
import { connect } from 'react-redux'
import eos from '../lib/eos'
import { Button, Input, FormGroup } from 'reactstrap'
import { logout } from '../action-creators/auth'
import { Redirect } from 'react-router-dom'

class Logout extends Component {
  constructor(props) {
    super(props)
    this.props.logout()
  }

  render() {
    console.log(this.props.auth)
    if (this.props.auth && !this.props.auth.loggedIn && !this.props.auth.user && !this.props.auth.eos) {
      return (
        <Redirect to="/login"/>
      )      
    }
    return (
      <div>Logging out...</div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
