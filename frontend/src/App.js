import React, { Component } from 'react'
import { connect } from 'react-redux'

import './App.css'
import 'react-table/react-table.css'

import { Switch, Route, Redirect } from 'react-router-dom'

import FileUpload from './organisms/file-upload'
import FileList from './organisms/file-list'
import File from './organisms/file'
import Login from './organisms/login'
import Logout from './organisms/logout'
import Header from './organisms/header'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    // this.props.loginAsBuyer()
  }
  render() {
    return (
      <div className="App">
        <Header/>
        <Switch>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/logout' component={Logout}/>
            <Route exact path='/' render={() => (
              this.props.auth.loggedIn ? (
                <FileList/>
              ) : (
                <Redirect to={{
                  pathname: "/login",
                  state: { from: window.location.pathname }
                }}/>
              )
            )}/>
            <Route exact path='/files/:uuid' render={() => (
              this.props.auth.loggedIn ? (
                <File/>
              ) : (
                <Redirect to={{
                  pathname: "/login",
                  state: { from: window.location.pathname }
                }}/>
              )
            )}/>
            <Route exact path='/upload' render={() => (
              this.props.auth.loggedIn ? (
                <FileUpload/>
              ) : (
                <Redirect to={{
                  pathname: "/login",
                  state: { from: window.location.pathname }
                }}/>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
