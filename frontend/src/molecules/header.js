import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import UserInfo from './user-info'

class Header extends Component {
  render() {
    return (
      <div>
        <ul className="mainNavigation">
          <li className="width10"><a href="https://slant.li/priveos" target="_blank"><img src="/img/dark_logo_transparent.png" width="100%" /></a></li>
          <li><NavLink to="/" exact activeClassName="active">Files</NavLink></li>
          <li><NavLink to="/upload" exact activeClassName="active">Upload</NavLink></li>
          <li>{(this.props.auth.loggedIn) ? (<UserInfo/>) : (<NavLink to="/login" exact activeClassName="active">Login</NavLink>)}</li>
        </ul>
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
