import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import UserInfo from './user-info'
import { connectScatter } from '../action-creators/auth'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.props.connectScatter()
  }
  render() {
    return (
      <div>
        <ul className="mainNavigation">
          <li className="width10"><a href="https://slant.li/priveos" target="_blank"><img src="/img/logo_priveos_blank_small.png" width="100%" /></a></li>
          <li><NavLink to="/" exact activeClassName="active"><i class="fas fa-copy"></i> Files</NavLink></li>
          <li><NavLink to="/upload" exact activeClassName="active"><i class="fas fa-upload"></i> Upload</NavLink></li>
          <li>{(this.props.auth.loggedIn) ? (<UserInfo/>) : (<NavLink to="/login" exact activeClassName="active"><i class="fas fa-sign-in-alt"/> Login</NavLink>)}</li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  connectScatter: () => dispatch(connectScatter())
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);
