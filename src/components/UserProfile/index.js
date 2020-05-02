import React from 'react';
import { Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import { UserProfileItem } from '../Users';
import * as ROUTES from '../../constants/routes';

const UserProfilePage = () => (
  <div>
    <h1>User Profile Page</h1>
    <Route
      exact
      path={ROUTES.USER_PROFILE_DETAILS}
      component={UserProfileItem}
    />
  </div>
);

const condition = authUser => authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(UserProfilePage);
