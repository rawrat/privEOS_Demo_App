import React, { Component } from 'react'
import { connect } from 'react-redux'

import './App.css'
import 'react-table/react-table.css'

import { Switch, Route, Redirect } from 'react-router-dom'

import Alert from './atoms/alert'
import FileUpload from './pages/file-upload'
import FileList from './pages/file-list'
import FileDetails from './pages/file-details'
import Login from './pages/login'
import Logout from './pages/logout'
import Header from './organisms/header'
import { connectScatter } from './action-creators/auth'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.props.connectScatter()
  }
  render() {
    return (
      <div className="App">
        <Alert error={this.props.files.error} />
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
                <FileDetails/>
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
  connectScatter: () => dispatch(connectScatter())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
