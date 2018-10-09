import React, { Component } from 'react';

class IpfsLink extends Component {
  render() {
    if (this.props.hash) {
      const href = "https://cloudflare-ipfs.com/ipfs/" + this.props.hash
      return (
        <div>
          <br/>
          Uploaded: <br/>
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
