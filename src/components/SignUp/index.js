import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SignUpPage = () => (
  <div>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          roles,
          joinedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
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
                    <Link to="/">
                      <FontAwesomeIcon icon={faArrowLeft} /> Sign up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
        <Fragment>
          <div className="content-section">
            <div className="tweets-container">
              <div className="profile-box-wrapper">
                <div className="div-block-12" />

                <div
                  className="profile-lower-box"
                  style={{ marginTop: '15px' }}
                >
                  <div class="landing-page-header">
                    <div
                      className="profile-username"
                      style={{ fontWeight: 'bold' }}
                    >
                      Sign up
                      <br />
                    </div>

                    <Fragment>
                      <div class="sign-in-form w-form">
                        <form
                          id="email-form-3"
                          name="email-form-3"
                          data-name="Email Form 3"
                          class="form-2 w-clearfix"
                          onSubmit={this.onSubmit}
                        >
                          <div class="email-form-section">
                            <label
                              for="email-2"
                              class="sign-in-form-label"
                            >
                              Name
                            </label>
                            <input
                              class="sign-in-form-field"
                              name="username"
                              value={username}
                              onChange={this.onChange}
                              type="text"
                              required="required"
                            />
                          </div>
                          <div class="password-form-section">
                            <label
                              for="email-3"
                              class="sign-in-form-label"
                            >
                              Email
                            </label>
                            <input
                              class="sign-in-form-field"
                              name="email"
                              value={email}
                              onChange={this.onChange}
                              type="text"
                              required="required"
                            />
                          </div>
                          <label
                            for="email-3"
                            class="sign-in-form-label"
                          >
                            Password
                          </label>
                          <input
                            class="sign-in-form-field"
                            name="passwordOne"
                            value={passwordOne}
                            onChange={this.onChange}
                            type="password"
                            required="required"
                          />

                          <label
                            for="email-3"
                            class="sign-in-form-label"
                          >
                            Confirm password
                          </label>
                          <input
                            class="sign-in-form-field"
                            name="passwordTwo"
                            value={passwordTwo}
                            onChange={this.onChange}
                            type="password"
                            required="required"
                          />

                          <label
                            style={{
                              fontSize: '12px',
                              position: 'relative',
                              bottom: '7px',
                              fontWeight: 'normal',
                            }}
                          >
                            Admin:
                            <input
                              name="isAdmin"
                              type="checkbox"
                              checked={isAdmin}
                              onChange={this.onChangeCheckbox}
                              style={{
                                position: 'relative',
                                top: '3px',
                              }}
                            />
                          </label>
                          <div style={{ height: '13px' }} />
                          {error && <p>{error.message}</p>}
                          <input
                            type="submit"
                            value="Sign up"
                            class="sign-in-button"
                            disabled={isInvalid}
                          />
                        </form>
                      </div>
                    </Fragment>
                    <div class="or">or</div>
                    <div class="text-block-6-copy">
                      <Link to={ROUTES.SIGN_IN}>
                        <div
                          class="submit-button w-button"
                          type="submit"
                          style={{
                            width: '100%',
                            marginBottom: '10px',
                          }}
                        >
                          <div>Log in</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="div-block-14" />
              </div>
            </div>
          </div>
        </Fragment>
      </div>
    );
  }
}

const SignUpLink = () => (
  <div class="text-block-6-copy">
    <Link to={ROUTES.SIGN_UP}>
      <div
        class="submit-button w-button"
        type="submit"
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <div>Create an account</div>
      </div>
    </Link>
  </div>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };
