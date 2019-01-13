import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import { loginWithScatter } from '../action-creators/auth'

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
          <a href="https://slant.li"><img src="/img/priveos_logo_black_transparent_big.png" width="40%" /></a>
          <br/><br/><br/>
          <Button className="btn btn-lg btn-success" onClick={this.props.loginWithScatter}>Login with Scatter</Button>
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  loginWithScatter: () => dispatch(loginWithScatter())
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
