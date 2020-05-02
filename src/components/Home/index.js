import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import { Tweets } from '../Tweets';

const HomePage = () => (
  <div>
    <img
      src="http://localhost:3000/img/default_profile_bigger.png"
      style={{
        width: 50,
        height: 50,
        borderRadius: 400 / 2,
      }}
    />
    <h1>Home</h1>
    <Tweets />
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);
