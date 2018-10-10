import React, { Component } from 'react'
import { connect } from 'react-redux'
import { store } from '../../lib/priveos.js'


class PriveosStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      encryption: null
    }

    this.generateSecret = this.generateSecret.bind(this)
  }
  generateSecret() {
    alert('generate secret')
  }
  render() {
    return (
      <div>
        <div>
          <button onClick={this.generateSecret}>Generate Secret</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PriveosStore);
