import React, { Component } from 'react'
import { connect } from 'react-redux'
import config from '../../config'
import { priveos } from '../../lib/priveos'


class PriveosStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      secret: null,
      nonce: null,
      enteredFilename: false
    }

    this.generateSecret = this.generateSecret.bind(this)
    this.onFilenameKey = this.onFilenameKey.bind(this)
  }
  generateSecret() {
    const self = this
    priveos.store(config.owner, this.state.filename).then((x) => {
      console.log('Successfully stored file', x)
      self.secret = x[0]
      self.nonce = x[1]
    })
  }
  onFilenameKey(evt) {
    const name = evt.target.value
    let enteredFilename = false
    if (name.length > 2) enteredFilename = true

    this.setState({
      enteredFilename,
      filename: name
    })
  }
  render() {
    return (
      <div>
        <input onKeyUp={this.onFilenameKey} placeholder="Enter Filename here..."/>
        <br/><br/>
        <button onClick={this.generateSecret} disabled={!this.state.enteredFilename}>Generate Secret</button>
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
