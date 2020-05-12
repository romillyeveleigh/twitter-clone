import React from 'react';

import { withFirebase } from '../Firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const SignOutButton = ({ firebase, signOutLinkType }) => {
  const onClick = () => {
    setTimeout(firebase.doSignOut, 650);
  };

  return signOutLinkType === 'button' ? (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <FontAwesomeIcon icon={faSignOutAlt} />
    </div>
  ) : (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      Sign out
    </div>
  );
};
export default withFirebase(SignOutButton);
