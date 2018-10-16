import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'


class Header extends Component {
  render() {
    return (
      <div>
        {this.props.auth.loggedIn ? (
          <ul className="mainNavigation">
            <li><Link to="/">Files</Link></li>
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/logout">Logout</Link></li>
            <li className="smallFont">Logged in as <strong>{this.props.auth.user}</strong></li>
          </ul>
        ) : ( <ul className="mainNavigation"><li></li></ul> )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);
