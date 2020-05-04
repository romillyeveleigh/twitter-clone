import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import { Tweets } from '../Tweets';

const HomePage = props => {
  return (
    <div>
      <div class="content-section">
        <div class="tweets-container">
          <div class="top-box-wrapper">
            <div class="title-left-box">
              <div
                class="top-box-title"
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
