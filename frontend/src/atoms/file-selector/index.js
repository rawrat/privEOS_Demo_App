import React, { Component } from 'react';
import { connect } from 'react-redux';


class FileSelector extends Component {
  render() {
    return (
      <input name="file" type="file"/>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(FileSelector);
