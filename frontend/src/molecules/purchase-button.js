import React, { Component } from 'react'
import { connect } from 'react-redux'
import { purchase } from '../action-creators/files'


class PurchaseButton extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12"><button className={`btn btn-danger ${this.props.className}`} onClick={(e) => { e.stopPropagation(); this.props.purchase(this.props.file)}} disabled={this.props.files.purchasing.find((x) => x == this.props.file.id)}>Purchase</button></div>
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
