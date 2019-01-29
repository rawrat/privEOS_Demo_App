import React, { Component } from 'react'
import { connect } from 'react-redux'
import { purchase } from '../action-creators/files'
import { Redirect } from 'react-router-dom'

class PurchaseButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      requireAuth: false
    }
    this.onClick = this.onClick.bind(this)
  }

  onClick(e) {
    e.stopPropagation()

    // require authentication
    if (this.props.auth.loggedIn) return this.props.purchase(this.props.file)

    // user is not authenticated yet, redirect him
    this.setState({
      requireAuth: true
    })
  }

  render() {
    if (this.state.requireAuth) {
      return (
        <Redirect to={{
          pathname: "/login",
          state: { from: window.location.pathname }
        }}/>
      )
    }
    return (
      <div>
        <div className="row">
          <div className="col-md-12"><button 
            className={`btn btn-danger ${this.props.className}`} 
            onClick={this.onClick}
            disabled={this.props.files.purchasing.find((x) => x == this.props.file.id)}>Purchase</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  purchase: (file) => dispatch(purchase(file)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseButton);
