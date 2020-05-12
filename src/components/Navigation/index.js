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
      <div class="navbar-section-desktop">
        <div class="navbar-left">
          <div class="navbar-left-content">
            <div class="navbar-main-logo-wrapper">
              <img
                src="/img/buzzby-logo.png"
                alt=""
                class="navbar-logo"
              />
            </div>
            <div class="navbar-menu-item">
              <div class="navbar-menu-icon">
                <strong class="bold-text">
                  <FontAwesomeIcon icon={faHome} />
                </strong>
              </div>
              <div class="navbar-menu-text">
                <Link to={ROUTES.HOME}>Home</Link>
              </div>
            </div>
            <div class="navbar-menu-item">
              <div class="navbar-menu-icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <div class="navbar-menu-text">
                <Link to={ROUTES.SEARCH}>Search</Link>
              </div>
            </div>
            <div class="navbar-menu-item">
              <div class="navbar-menu-icon">
                <FontAwesomeIcon icon={faUserRegular} />
              </div>
              <div class="navbar-menu-text">
                <Link to={`${ROUTES.USER_PROFILE}/${authUser.uid}`}>
                  Profile
                </Link>
              </div>
            </div>
            {!!authUser.roles[ROLES.ADMIN] && (
              <div class="navbar-menu-item">
                <div class="navbar-menu-icon">
                  <FontAwesomeIcon icon={faUserCog} />
                </div>
                <div class="navbar-menu-text">
                  <Link to={ROUTES.ADMIN}>Admin</Link>
                </div>
              </div>
            )}
            <div class="navbar-menu-item">
              <div class="navbar-menu-icon">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </div>
              <div class="navbar-menu-text">
                <SignOutButton />
              </div>
            </div>
          </div>
          <div class="navbar-left-margin" />
        </div>
        <div class="navbar-center" />
        <div class="navbar-right" />
      </div>
    </Fragment>
    <Fragment>
      <div class="mobile-section">
        <div class="mobile-navbar">
          <div class="mobile-navbar-icon">
            <Link to={ROUTES.HOME}>
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </div>
          <div class="mobile-navbar-icon">
            {' '}
            <Link to={ROUTES.SEARCH}>
              <FontAwesomeIcon icon={faSearch} />
            </Link>
          </div>
          <div class="mobile-navbar-icon">
            <Link to={`${ROUTES.USER_PROFILE}/${authUser.uid}`}>
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </div>
          <div class="mobile-navbar-icon">
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
      <div class="navbar-section-desktop">
        <div class="navbar-left">
          <div class="navbar-left-content">
            <div class="navbar-main-logo-wrapper">
              <img
                src="/img/buzzby-logo.png"
                alt=""
                class="navbar-logo"
              />
            </div>
            <div class="navbar-menu-item">
              <div class="navbar-menu-icon">
                <strong class="bold-text">
                  <FontAwesomeIcon icon={faHome} />
                </strong>
              </div>
              <div class="navbar-menu-text">
                <Link to={ROUTES.LANDING}>Welcome</Link>
              </div>
            </div>

            <div class="navbar-menu-item">
              <div class="navbar-menu-icon">
                <FontAwesomeIcon icon={faSignInAlt} />
              </div>
              <div class="navbar-menu-text">
                <Link to={ROUTES.SIGN_IN}>Sign In</Link>
              </div>
            </div>
            <div class="navbar-menu-item">
              <div class="navbar-menu-icon">
                <FontAwesomeIcon icon={faUserPlus} />
              </div>
              <div class="navbar-menu-text">
                <Link to={ROUTES.SIGN_UP}>Sign up</Link>
              </div>
            </div>
          </div>
          <div class="navbar-left-margin" />
        </div>
        <div class="navbar-center" />
        <div class="navbar-right" />
      </div>
    </Fragment>
    <Fragment>
      <div class="mobile-section">
        <div class="mobile-navbar">
          <div class="mobile-navbar-icon">
            <Link to={ROUTES.LANDING}>
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </div>
          <div class="mobile-navbar-icon">
            <Link to={ROUTES.SIGN_IN}>
              <FontAwesomeIcon icon={faSignInAlt} />
            </Link>
          </div>
          <div class="mobile-navbar-icon">
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
