import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import FileUpload from './molecules/file-upload'


class App extends Component {
  upload() {
    this.props.upload()
  }
  render() {
    return (
      <div className="App">
        <h1>Upload File</h1>
        <FileUpload/>
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
