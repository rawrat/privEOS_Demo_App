import React, { Component } from 'react'
import { connect } from 'react-redux'
import eos from '../lib/eos'
import { Button, Input, FormGroup } from 'reactstrap';

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: localStorage.name || "",
      privateKey: localStorage.privateKey || ""
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
    localStorage.privateKey = this.state.privateKey
    this.login(this.state.privateKey)
  }
  login(privateKey) {
    eos.login(privateKey)
  }

  render() {
    return (
      <div>
        <FormGroup>
          <Input type="text" name="name" placeholder="EOS Account Name" value={this.state.name} onChange={this.updateField}/>
          <br/>
          <textarea name="privateKey" placeholder="Enter your Private Key here..." value={this.state.privateKey} onChange={this.updateField} className="form-control input"/>
          <br/>
          <Button type="submit" onClick={this.update}>Update</Button>
        </FormGroup>
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
