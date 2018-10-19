import React, { Component } from 'react'
import { connect } from 'react-redux'


class PurchaseButton extends Component {
  constructor(props) {
    super(props)

    this.purchase = this.purchase.bind(this)
  }

  purchase() {
    this.props.auth.eos.purchase(this.props.auth.user, this.props.file.price, this.props.file.uuid)
  }
  
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12"><button className="btn btn-danger" onClick={this.purchase}>Purchase for {this.props.file.price}</button></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseButton);
