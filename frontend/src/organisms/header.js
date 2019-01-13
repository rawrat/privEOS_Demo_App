import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Balance from '../molecules/balance'


class Header extends Component {
  render() {
    return (
      <div>
        {this.props.auth.loggedIn ? (
          <ul className="mainNavigation">
            <li className="width10"><a href="https://slant.li/priveos" target="_blank"><img src="/img/dark_logo_transparent.png" width="100%" /></a></li>
            <li><NavLink to="/" exact activeClassName="active">Files</NavLink></li>
            <li><NavLink to="/upload" exact activeClassName="active">Upload</NavLink></li>
            <li>Logged in as <strong>{this.props.auth.account.name} (<Balance/>) <NavLink to="/logout" exact activeClassName="active" className="logout danger">Logout</NavLink></strong></li>
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
