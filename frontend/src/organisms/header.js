import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'


class Header extends Component {
  render() {
    return (
      <div>
        {this.props.auth.loggedIn ? (
          <ul className="mainNavigation">
            <li className="width10"><a href="https://slant.li/priveos" target="_blank"><img src="/img/dark_logo_transparent.png" width="100%" /></a></li>
            <li><NavLink to="/" exact="true" activeClassName="active">Files</NavLink></li>
            <li><NavLink to="/upload" exact="true" activeClassName="active">Upload</NavLink></li>
            <li className="smallFont">Logged in as <strong>{this.props.auth.account.name} <NavLink to="/logout" exact="true" activeClassName="active" className="logout danger">Logout</NavLink></strong></li>
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
