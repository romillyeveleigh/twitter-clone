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
      <div className="content-section">
        <div className="tweets-container">
          <div className="top-box-wrapper">
            <div className="title-left-box">
              <div
                className="top-box-title"
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
