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
    <div class="content-section">
      <div class="tweets-container">
        <div class="top-box-wrapper">
          <div class="title-left-box">
            <div class="top-box-title" style={{ cursor: 'pointer' }}>
              <Link to="/home" style={{ fontweight: '400px' }}>
                <FontAwesomeIcon icon={faArrowLeft} />
                {'   '}Tweet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
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
