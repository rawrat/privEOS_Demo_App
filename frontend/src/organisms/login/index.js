import React, { Component } from 'react'
import { connect } from 'react-redux'
import ipfs from '../../lib/ipfs'
import PriveosStore from '../../atoms/priveos-store'
import IpfsUpload from '../../molecules/ipfs-upload'


class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: localStorage.name,
      key: localStorage.key
    }

    this.update = this.update.bind(this)
    this.updateField = this.updateField.bind(this)
  }
  updateField(e) {
    const update = {}
    update[e.target.name] = e.target.value
    this.setState(update)
  }
  update() {
    localStorage.name = this.state.name
    localStorage.key = this.state.key
  }
  render() {
    return (
      <div>
          <input type="text" name="name" placeholder="EOS Account Name" value={this.state.name} onChange={this.updateField}/>
          <br/><br/>
          <textarea name="key" placeholder="Enter your Private Key here..." onChange={this.updateField}></textarea>
          <br/>
          <button type="submit" onClick={this.update}>Update</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
