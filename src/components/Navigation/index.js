import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import { withFirebase } from '../Firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSearch,
  faUserCog,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons/faUser.js';

const Navigation = ({ authUser }) =>
  authUser ? (
    <NavigationAuth authUser={authUser} />
  ) : (
    <NavigationNonAuth />
  );

const NavigationAuth = ({ authUser }) => (
  <Fragment>
    <Fragment>
      <div className="navbar-section-desktop">
        <div className="navbar-left">
          <div className="navbar-left-content">
            <div className="navbar-main-logo-wrapper">
              <img
                src="/img/buzzby-logo.png"
                alt=""
                className="navbar-logo"
              />
            </div>
            <div className="navbar-menu-item">
              <div className="navbar-menu-icon">
                <strong className="bold-text">
                  <FontAwesomeIcon icon={faHome} />
                </strong>
              </div>
              <div className="navbar-menu-text">
                <Link to={ROUTES.HOME}>Home</Link>
              </div>
            </div>
            <div className="navbar-menu-item">
              <div className="navbar-menu-icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <div className="navbar-menu-text">
                <Link to={ROUTES.SEARCH}>Search</Link>
              </div>
            </div>
            <div className="navbar-menu-item">
              <div className="navbar-menu-icon">
                <FontAwesomeIcon icon={faUserRegular} />
              </div>
              <div className="navbar-menu-text">
                <Link to={`${ROUTES.USER_PROFILE}/${authUser.uid}`}>
                  Profile
                </Link>
              </div>
            </div>
            {!!authUser.roles[ROLES.ADMIN] && (
              <div className="navbar-menu-item">
                <div className="navbar-menu-icon">
                  <FontAwesomeIcon icon={faUserCog} />
                </div>
                <div className="navbar-menu-text">
                  <Link to={ROUTES.ADMIN}>Admin</Link>
                </div>
              </div>
            )}
            <div className="navbar-menu-item">
              <div className="navbar-menu-icon">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </div>
              <div className="navbar-menu-text">
                <SignOutButton />
              </div>
            </div>
          </div>
          <div className="navbar-left-margin" />
        </div>
        <div className="navbar-center" />
        <div className="navbar-right" />
      </div>
    </Fragment>
    <Fragment>
      <div className="mobile-section">
        <div className="mobile-navbar">
          <div className="mobile-navbar-icon">
            <Link to={ROUTES.HOME}>
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </div>
          <div className="mobile-navbar-icon">
            {' '}
            <Link to={ROUTES.SEARCH}>
              <FontAwesomeIcon icon={faSearch} />
            </Link>
          </div>
          <div className="mobile-navbar-icon">
            <Link to={`${ROUTES.USER_PROFILE}/${authUser.uid}`}>
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </div>
          <div className="mobile-navbar-icon">
            <SignOutButton signOutLinkType={'button'} />
          </div>
        </div>
      </div>
    </Fragment>
  </Fragment>
);

const NavigationNonAuth = () => (
  <Fragment>
    <Fragment>
      <div className="navbar-section-desktop">
        <div className="navbar-left">
          <div className="navbar-left-content">
            <div className="navbar-main-logo-wrapper">
              <img
                src="/img/buzzby-logo.png"
                alt=""
                className="navbar-logo"
              />
            </div>
            <div className="navbar-menu-item">
              <div className="navbar-menu-icon">
                <strong className="bold-text">
                  <FontAwesomeIcon icon={faHome} />
                </strong>
              </div>
              <div className="navbar-menu-text">
                <Link to={ROUTES.LANDING}>Welcome</Link>
              </div>
            </div>

            <div className="navbar-menu-item">
              <div className="navbar-menu-icon">
                <FontAwesomeIcon icon={faSignInAlt} />
              </div>
              <div className="navbar-menu-text">
                <Link to={ROUTES.SIGN_IN}>Sign In</Link>
              </div>
            </div>
            <div className="navbar-menu-item">
              <div className="navbar-menu-icon">
                <FontAwesomeIcon icon={faUserPlus} />
              </div>
              <div className="navbar-menu-text">
                <Link to={ROUTES.SIGN_UP}>Sign up</Link>
              </div>
            </div>
          </div>
          <div className="navbar-left-margin" />
        </div>
        <div className="navbar-center" />
        <div className="navbar-right" />
      </div>
    </Fragment>
    <Fragment>
      <div className="mobile-section">
        <div className="mobile-navbar">
          <div className="mobile-navbar-icon">
            <Link to={ROUTES.LANDING}>
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </div>
          <div className="mobile-navbar-icon">
            <Link to={ROUTES.SIGN_IN}>
              <FontAwesomeIcon icon={faSignInAlt} />
            </Link>
          </div>
          <div className="mobile-navbar-icon">
            <Link to={ROUTES.SIGN_UP}>
              <FontAwesomeIcon icon={faUserPlus} />
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  </Fragment>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);
