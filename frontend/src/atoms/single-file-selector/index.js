import React, { Component } from 'react';

class SingleFileSelector extends Component {
  render() {
    return (
      <input name="file" type="file" onChange={this.props.onSelect}/>
    );
  }
}

export default SingleFileSelector;
