import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Balance from './balance'
import { connect } from 'react-redux'

class UserInfo extends Component {
  render() {
    return (
      <span>
        {(this.props.auth.loggedIn) ? (
          <span>Logged in as <strong>{this.props.auth.account.name} </strong>(<Balance/>)<strong> <NavLink to="/logout" exact activeClassName="active" className="logout danger">Logout</NavLink></strong></span>
        ) : (
          <span></span>
        )}
      </span>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)
