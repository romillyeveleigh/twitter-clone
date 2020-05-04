import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import { withAuthorization, withEmailVerification } from '../Session';
import UserList from './UserList';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SearchPage = () => (
  <div>
    <Fragment>
      <div class="content-section">
        <div class="tweets-container">
          <div class="top-box-wrapper">
            <div class="title-left-box">
              <div
                class="top-box-title"
                style={{ cursor: 'pointer' }}
              >
                <Link to="/home">
                  <FontAwesomeIcon icon={faArrowLeft} />
                  {'   '}
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
    <UserList />
    <br />
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(SearchPage);
