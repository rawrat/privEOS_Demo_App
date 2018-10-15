import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom'

import FileUpload from './organisms/file-upload'
import FileList from './organisms/file-list'
import Login from './organisms/login'
import Header from './organisms/header'
import auth from './lib/auth'


function requireAuth(nextState, replace) {
  console.log('require Auth', nextState)
  return (<Redirect to="login"/>)
}

class App extends Component {
  upload() {
    this.props.upload()
  }
  render() {
    return (
      <div className="App">
        <Header/>
        <Switch>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/' render={() => (
              auth.loggedIn() ? (
                <FileList/>
              ) : (
                <Redirect to="/login"/>
              )
            )}/>
            <Route exact path='/upload' render={() => (
              auth.loggedIn() ? (
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
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
