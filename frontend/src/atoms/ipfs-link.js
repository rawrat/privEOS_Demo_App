import React, { Component } from 'react';
import { getUrl } from '../lib/ipfs'

class IpfsLink extends Component {
  render() {
    if (this.props.hash) {
      const href = getUrl(this.props.hash)
      return (
        <div>
          <a href={href} className="smallFont">{href}</a>
        </div>
      )
    } else {
      return (
        <span></span>
      )
    }
  }
}

export default IpfsLink;
