import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const PasswordForgetPage = () => (
  <div>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
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
                      <FontAwesomeIcon icon={faArrowLeft} /> Password
                      reset
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
                      style={{ fontWeight: 'bold' }}
                    >
                      Password reset
                      <br />
                    </div>

                    <Fragment>
                      <div className="sign-in-form w-form">
                        <form
                          className="form-2 w-clearfix"
                          onSubmit={this.onSubmit}
                        >
                          <label
                            for="email-3"
                            className="sign-in-form-label"
                          >
                            Email
                          </label>
                          <input
                            className="sign-in-form-field"
                            name="email"
                            value={this.state.email}
                            onChange={this.onChange}
                            type="text"
                            required="required"
                          />

                          <div style={{ height: '13px' }} />
                          {error && <p>{error.message}</p>}

                          <div
                            className="social-signin-button"
                            type="submit"
                            disabled={isInvalid}
                            onClick={this.onSubmit}
                            style={{
                              backgroundColor: 'white',
                              height: '33px',
                              marginTop: '8px',
                            }}
                          >
                            <div
                              className="social-signin-label"
                              style={{
                                fontSize: 13.5,
                                fontWeight: 700,
                              }}
                            >
                              Reset my password
                            </div>
                          </div>
                        </form>
                      </div>
                    </Fragment>
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

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>forgot password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
