import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import { Tweets } from '../Tweets';

const HomePage = props => {
  return (
    <div>
      <img
        src={`https://api.adorable.io/avatars/50/${
          props.authUser.uid
        }`}
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
};
const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);
