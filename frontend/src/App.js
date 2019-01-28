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
import Header from './molecules/header'
import { initialize } from './action-creators/root'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.props.initialize()
  }
  render() {
    return (
      <div className="App">
        {(this.props.files.alert) ? (<Alert alert={this.props.files.alert}/>) : (<span></span>)}
        {(this.props.root.initializing == false) ? (
          <span>
            <Header/>
            <Switch>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/logout' component={Logout}/>
                <Route exact path='/' component={FileList}/>
                <Route exact path='/files/:uuid' component={FileDetails}/>
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
          </span>
        ) : (<span></span>)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  initialize: () => dispatch(initialize())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
