import React from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import { withAuthorization, withEmailVerification } from '../Session';
import UserList from './UserList';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SearchPage = () => (
  <div>
    <Link to="/home">
      <FontAwesomeIcon icon={faArrowLeft} />
    </Link>
    <UserList />
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(SearchPage);
