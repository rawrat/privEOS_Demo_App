import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import { loginAsUser, loginWithScatter } from '../action-creators/auth'
import config from '../config'

class Login extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log('update state', this.props.auth)
    if (this.props.auth && this.props.auth.loggedIn) {
      const redirectTo = this.props.location && this.props.location.state && this.props.location.state.from || '/'
      return (
        <Redirect to={redirectTo}/>
      )      
    }
    else {
      return (
      
        <div>
          <div className="row">
            <div className="col-md-1">
              Login as:
            </div>
            <div className="col-md-1">
              <Button className="btn btn-default" onClick={this.props.loginAsAlice}>Alice</Button>
            </div>
            <div className="col-md-1">
              <Button className="btn btn-default" onClick={this.props.loginAsBob}>Bob</Button>
            </div>
            <div className="col-md-9">
              <Button className="btn btn-default" onClick={this.props.loginWithScatter}>Scatter</Button>
            </div>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  loginAsAlice: () => dispatch(loginAsUser(config.eosAccounts.alice.name, config.eosAccounts.alice.privateKey)),
  loginAsBob: () => dispatch(loginAsUser(config.eosAccounts.bob.name, config.eosAccounts.bob.privateKey)),
  loginWithScatter: () => dispatch(loginWithScatter())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
