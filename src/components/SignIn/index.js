import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SignInPage = () => (
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
                <Link to="/">
                  <FontAwesomeIcon icon={faArrowLeft} /> Sign in
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
              <div className="landing-page-header">
                <div
                  className="profile-username"
                  style={{ fontWeight: 700 }}
                >
                  Sign in
                  <br />
                </div>
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

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div className="sign-in-form w-form">
        <form
          id="email-form-3"
          name="email-form-3"
          data-name="Email Form 3"
          className="form-2 w-clearfix"
          onSubmit={this.onSubmit}
        >
          <div className="email-form-section">
            <label for="email-2" className="sign-in-form-label">
              Email
            </label>
            <input
              className="sign-in-form-field"
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              required="required"
            />
          </div>
          <div className="password-form-section">
            <label for="email-3" className="sign-in-form-label">
              Password
            </label>
            <input
              className="sign-in-form-field"
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              required="required"
            />
          </div>
          <div
            className="forgot-password"
            style={{ textDecoration: 'underline' }}
          >
            <PasswordForgetLink />
          </div>
          <div style={{ height: '13px' }} />
          {error && <p>{error.message}</p>}
          <input
            type="submit"
            value="Log in"
            className="sign-in-button"
            disabled={isInvalid}
          />
        </form>
      </div>
    );
  }
}

class SignInGuestBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const email = 'guest@gmail.com';
    const password = 'guest123';

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div className="text-block-6-copy">
        <div
          className="submit-button w-button"
          type="submit"
          onClick={this.onSubmit}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <div>Demo (log in as guest)</div>
        </div>
      </div>
    );
  }
}

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
      })
      .then(() => {
        this.setState({ error: null });
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

  render() {
    const { error } = this.state;

    return (
      <div
        className="social-signin-button"
        type="submit"
        onClick={this.onSubmit}
        style={{ marginTop: '10px' }}
      >
        <img
          src="/img/google-logo.png"
          width="23"
          height="23"
          alt=""
        />
        <div className="social-signin-label">Log in with Google</div>
      </div>
    );
  }
}

class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: {},
        });
      })
      .then(() => {
        this.setState({ error: null });
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

  render() {
    const { error } = this.state;

    return (
      <div
        className="social-signin-button"
        type="submit"
        onClick={this.onSubmit}
      >
        <img
          src="/img/facebook-logo.png"
          width="23"
          height="23"
          alt=""
        />
        <div className="social-signin-label">
          Log in with Facebook
        </div>
      </div>
    );
  }
}

class SignInTwitterBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: {},
        });
      })
      .then(() => {
        this.setState({ error: null });
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

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign In with Twitter</button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const SignInGuest = compose(
  withRouter,
  withFirebase,
)(SignInGuestBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
  withRouter,
  withFirebase,
)(SignInFacebookBase);

const SignInTwitter = compose(
  withRouter,
  withFirebase,
)(SignInTwitterBase);

export default SignInPage;

export {
  SignInForm,
  SignInGuest,
  SignInGoogle,
  SignInFacebook,
  SignInTwitter,
};
