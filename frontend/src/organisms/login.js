import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import { loginAsUser } from '../action-creators/auth'
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
            <div className="col-md-2">
              <Button className="btn btn-default" onClick={this.props.loginAsBuyer}>Login as Buyer</Button>
            </div>
            <div className="col-md-10">
              <Button className="btn btn-default" onClick={this.props.loginAsSeller}>Login as Seller</Button>
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
  loginAsBuyer: () => dispatch(loginAsUser(config.eosAccounts.buyer.name, config.eosAccounts.buyer.key)),
  loginAsSeller: () => dispatch(loginAsUser(config.eosAccounts.seller.name, config.eosAccounts.seller.key))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
