import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './app.css';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import UserProfilePage from '../UserProfile';
import SearchPage from '../Search';
import RepliesPage from '../Replies';
import ToS from '../ToS/ToS';
import ScrollIntoView from '../ScrollIntoView';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div>
      <ScrollIntoView>
        <Navigation />
        <div className="navbar-spacer" />
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.TOS} component={ToS} />
        <Route
          path={ROUTES.PASSWORD_FORGET}
          component={PasswordForgetPage}
        />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        <Route
          path={ROUTES.USER_PROFILE}
          component={UserProfilePage}
        />
        <Route path={ROUTES.SEARCH} component={SearchPage} />
        <Route path={ROUTES.REPLIES} component={RepliesPage} />
      </ScrollIntoView>
    </div>
  </Router>
);

export default withAuthentication(App);
