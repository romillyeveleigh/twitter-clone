import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import { Tweets } from '../Tweets';

const HomePage = props => {
  return (
    <div>
      <div className="content-section">
        <div className="tweets-container">
          <div className="top-box-wrapper">
            <div className="title-left-box">
              <div
                className="top-box-title"
                style={{ cursor: 'pointer' }}
              >
                Home
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tweets />
    </div>
  );
};
const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);
