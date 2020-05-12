import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Spinner from '../Spinner/Spinner';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      text: '',
    };
  }

  componentDidMount() {
    if (!this.props.users.length) {
      this.setState({ loading: true });
    }

    this.props.firebase.users().on('value', snapshot => {
      this.props.onSetUsers(snapshot.val());

      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  onChange = event => {
    this.setState({ text: event.target.value });
  };

  render() {
    const { users } = this.props;
    const { loading, text } = this.state;

    return (
      <div>
        <Fragment>
          <div class="content-section">
            <div class="tweets-container">
              <div class="search-box-wrapper">
                <div class="search-box">
                  <div class="div-block-17">
                    <div class="div-block-15">
                      <div class="div-block-16">
                        <div>
                          <FontAwesomeIcon icon={faSearch} />
                        </div>
                      </div>
                      <div class="form-block-2 w-form">
                        <form
                          id="email-form-2"
                          name="email-form-2"
                          data-name="Email Form 2"
                          onSubmit={e => e.preventDefault()}
                        >
                          <input
                            type="text"
                            id="search"
                            ref={text}
                            class="user-search-text w-input2"
                            maxlength="256"
                            name="name"
                            data-name="Name"
                            placeholder=""
                            id="name"
                            onChange={this.onChange}
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
        {loading && <Spinner />}

        {!loading &&
          users
            .filter(user =>
              user.username
                .toUpperCase()
                .includes(text.toUpperCase()),
            )
            .map(user => (
              <TransitionGroup>
                <CSSTransition
                  key={user.uid}
                  timeout={200}
                  classNames="my-node"
                >
                  <Fragment>
                    <div className="content-section">
                      <div className="tweets-container">
                        <div
                          className="search-result-wrapper"
                          key={user.uid}
                        >
                          <div className="title-left-box">
                            {user.uid !==
                            'VVZwP9faTeT4CtrDtHSS7aKDKZO2' ? (
                              <img
                                src={`https://api.adorable.io/avatars/100/${
                                  user.uid
                                }`}
                                alt=""
                                className="avatar"
                              />
                            ) : (
                              <img
                                src="/img/detective.png"
                                alt=""
                                className="avatar"
                              />
                            )}
                          </div>
                          <div className="search-result-right-box">
                            <div className="tweet-author-row">
                              <div className="tweet-username-handle">
                                <div className="tweet-username">
                                  <Link
                                    to={`${ROUTES.USER_PROFILE}/${
                                      user.uid
                                    }`}
                                  >
                                    {user.username}
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="tweet-message-replied">
                              <div className="tweet-handle">
                                @
                                {user.username
                                  .toLowerCase()
                                  .replace(/ /g, '')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                </CSSTransition>
              </TransitionGroup>
            ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: Object.keys(state.userState.users || {}).map(key => ({
    ...state.userState.users[key],
    uid: key,
  })),
});

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserList);
