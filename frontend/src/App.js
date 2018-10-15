import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom'
import { loginAsUser } from './action-creators/auth'

import FileUpload from './organisms/file-upload'
import FileList from './organisms/file-list'
import Login from './organisms/login'
import Header from './organisms/header'
import config from './config'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.props.loginAsBuyer()
  }
  render() {
    return (
      <div className="App">
        <Header/>
        <Switch>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/' render={() => (
              this.props.auth.loggedIn ? (
                <FileList/>
              ) : (
                <Redirect to="/login"/>
              )
            )}/>
            <Route exact path='/upload' render={() => (
              this.props.auth.loggedIn ? (
                <FileUpload/>
              ) : (
                <Redirect to="/login"/>
              )
            )}/>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  loginAsBuyer: () => dispatch(loginAsUser(config.eosAccounts.buyer.name, config.eosAccounts.buyer.key)),
  loginAsSeller: () => dispatch(loginAsUser(config.eosAccounts.seller.name, config.eosAccounts.seller.key))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
