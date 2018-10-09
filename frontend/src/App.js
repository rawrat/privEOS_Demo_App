import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import { hello } from './actions/hello'

class App extends Component {
  sayHello = (event) => {
    this.props.hello();
  }
  render() {
    return (
      <div className="App">
        Hello world
        <br/><br/>
        <button onClick={this.sayHello}>Say "hello"</button>
        <br/>
        <pre>
          { JSON.stringify(this.props) }
        </pre>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  hello: () => dispatch(hello())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
