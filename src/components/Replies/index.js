import React from 'react';
import { Route } from 'react-router-dom';
import { compose } from 'recompose';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { withAuthorization, withEmailVerification } from '../Session';
import RepliesItem from './RepliesItem';
import * as ROUTES from '../../constants/routes';

const RepliesPage = props => (
  <div>
    <Link to="/home">
      <FontAwesomeIcon icon={faArrowLeft} />
    </Link>
    <h1>Tweet</h1>
    <Route
      exact
      path={ROUTES.REPLIES_DETAILS}
      component={RepliesItem}
    />
  </div>
);

const condition = authUser => authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(RepliesPage);
