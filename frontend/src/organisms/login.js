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
          <h1>Welcome to the privEOS Demo App</h1>
          <p>This demo demonstrates the capabilities of privEOS as a market place for files.</p>
          <Button className="btn btn-lg btn-success" onClick={this.props.loginWithScatter}>Login with Scatter</Button>
          <br/><br/>
          {config.dev ? (
            <div>
              {config.eosAccounts.map((x) => (
                <span key={x.name}><Button className="btn btn-lg btn-default" onClick={() => this.props.loginAsUser(x.name, x.privateKey, x.publicKey)}>{x.name}</Button>&nbsp;</span>
              ))}
            </div>
          ) : (<div></div>)}
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  loginAsUser: (user, privateKey, publicKey) => dispatch(loginAsUser(user, privateKey, publicKey)),
  loginWithScatter: () => dispatch(loginWithScatter())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
