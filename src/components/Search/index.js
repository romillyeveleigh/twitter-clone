import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import UserList from './UserList';

const SearchPage = () => (
  <div>
    <h1>Search Page</h1>
    <p>The Search Page is accessible by every signed in user.</p>

    <UserList />
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(SearchPage);
