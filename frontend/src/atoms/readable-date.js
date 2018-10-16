import React, { Component } from 'react';

class ReadableDate extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    console.log(this.props, this.state, this.props.timestamp)
    const date = new Date(this.props.timestamp).toString()

    return (
      <div>
        {date}
      </div>
    )
  }
}

export default ReadableDate;
