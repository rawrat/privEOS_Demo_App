import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Switch, Route } from 'react-router-dom'

import FileUpload from './organisms/file-upload'
import Login from './organisms/login'
import Header from './organisms/header'


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
          <Route exact path='/' component={FileUpload}/>
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
