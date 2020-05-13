import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
  SignInForm,
  SignInGuest,
  SignInGoogle,
  SignInFacebook,
} from '../SignIn';
import { SignUpLink } from '../SignUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

const Landing = () => (
  <div>
    <Fragment>
      <div className="content-section">
        <div className="tweets-container">
          <div className="profile-box-wrapper">
            <div className="div-block-12 splash" />

            <div
              className="profile-lower-box"
              style={{ marginTop: '15px' }}
            >
              <div
                className="profile-username"
                style={{ fontWeight: 'bold' }}
              >
                See what's happening in the world right now
              </div>

              <div className="text-block-6-copy">
                <SignInForm />
                <SignInGuest />
                <div className="or">or</div>
                <SignInGoogle />
                <SignInFacebook />
                <div className="or">or</div>
                <SignUpLink />
              </div>
            </div>

            <div className="div-block-14" />
          </div>
        </div>
      </div>
    </Fragment>
  </div>
);

export default Landing;
