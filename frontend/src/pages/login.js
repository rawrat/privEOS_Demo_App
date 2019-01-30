import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import LoadingBar from '../atoms/loading-bar'
import { Redirect } from 'react-router-dom'
import { connectScatter, loginWithScatter } from '../action-creators/auth'
import { CONNECT_SCATTER_SUCCESS, CONNECT_SCATTER_ERROR } from '../lib/action-types'

class Login extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log('update state', this.props.auth)

    // when the login was successful, redirect the user from where he came
    if (this.props.auth && this.props.auth.loggedIn) {
      const redirectTo = this.props.location && this.props.location.state && this.props.location.state.from || '/'
      return (
        <Redirect to={redirectTo}/>
      )      
    } else {
      let content = <span><LoadingBar/>{ this.props.auth.status ? this.props.auth.status : 'Looking for scatter...' }</span>
      if (this.props.auth.status == CONNECT_SCATTER_ERROR) {
        content = <div className="alert alert-danger"><strong>No Scatter found</strong><br/>Is scatter running?</div>
      } else if ([CONNECT_SCATTER_SUCCESS, null].some(x => x == this.props.auth.status)) {
        content = <Button className="btn btn-lg btn-success" onClick={this.props.loginWithScatter}>Login with Scatter</Button>
      }
      return (
        <div>
          <h3>Login</h3>
          Please login to purchase, download or upload files!
          <br/><br/>
          {content}
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
