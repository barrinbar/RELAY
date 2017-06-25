// @flow

import $ from 'jquery'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { APP_NAME } from '../config'
import {
  HOME_PAGE_ROUTE,
  RULES_PAGE_ROUTE,
//  HELLO_ASYNC_PAGE_ROUTE,
//  NOT_FOUND_DEMO_PAGE_ROUTE,
} from '../routes'

const handleNavLinkClick = () => {
  $('body').scrollTop(0)
  $('.js-navbar-collapse').collapse('hide')
}

const Nav = () =>
  <nav className="navbar navbar-toggleable-md navbar-inverse fixed-top bg-primary">
    <button className="navbar-toggler navbar-toggler-end" type="button" role="button" data-toggle="collapse" data-target=".js-navbar-collapse">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="js-navbar-collapse collapse navbar-collapse">
      <Link to={HOME_PAGE_ROUTE} className="navbar-brand">
        {APP_NAME}
      </Link>
      <ul className="navbar-nav mr-auto">
        {[
          { route: HOME_PAGE_ROUTE, label: 'Home' },
          { route: RULES_PAGE_ROUTE, label: 'Rules' },
//          { route: HELLO_ASYNC_PAGE_ROUTE, label: 'Say Hello Asynchronously' },
//          { route: NOT_FOUND_DEMO_PAGE_ROUTE, label: '404 Demo' },
        ].map(link => (
          <li className="nav-item" key={link.route}>
            <NavLink to={link.route} className="nav-link" activeStyle={{ color: 'white' }} exact onClick={handleNavLinkClick}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
      <form className="form-inline navbar-end">
        <input type="text" placeholder="Email" className="form-control mr-sm-2" />
        <input type="password" placeholder="Password" className="form-control mr-sm-2" />
        <button type="submit" className="btn btn-success my-2 my-sm-0">Sign in</button>
      </form>
    </div>
  </nav>

export default Nav
