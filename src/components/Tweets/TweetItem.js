import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

import LikeButton from './LikeButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentAlt,
  faTrashAlt,
  faEdit,
} from '@fortawesome/free-regular-svg-icons';

class TweetItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      editMode: false,
      editText: this.props.message.text,
      count: '',
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

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);
    this.setState({ editMode: false });
  };

  getUsernameFromUserId = userId => {
    if (
      this.props.users.length &&
      this.props.users.filter(i => i.uid === userId)[0]
    ) {
      return this.props.users.filter(i => i.uid === userId)[0]
        .username;
    }
  };

  getReplyCount = () => {
    if (this.state.count === '') {
      this.props.firebase
        .messages()
        .orderByChild('replyTo')
        .equalTo(this.props.message.uid)
        .on('value', snapshot => {
          if (snapshot.val() !== null) {
            var num = 0;
            num = Object.keys(snapshot.val()).length;
            this.setState({ count: num });
          }
        });
    }
  };

  render() {
    const {
      authUser,
      message,
      likes,
      onRemoveMessage,
      onEditMessage,
    } = this.props;
    const { editMode, editText } = this.state;

    // get reply count on every refresh
    this.getReplyCount();

    return (
      <Fragment>
        <div className="content-section">
          <div className="tweets-container">
            <div className="tweet-wrapper">
              {editMode ? (
                <input
                  type="text"
                  value={editText}
                  onChange={this.onChangeEditText}
                />
              ) : (
                <Fragment>
                  <div className="tweet-left-box">
                    <img
                      src={`https://api.adorable.io/avatars/50/${
                        message.userId
                      }`}
                      alt=""
                      className="avatar"
                    />
                  </div>
                  <div className="tweet-right-box">
                    <div className="tweet-message-replied">
                      <div className="tweet-message-text-replied">
                        {message.replyToId && (
                          <Link
                            to={`${ROUTES.REPLIES}/${
                              message.replyTo
                            }`}
                          >
                            Replying to @
                            {this.getUsernameFromUserId(
                              message.replyToId,
                            )}
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="tweet-author-row">
                      <div className="tweet-username-handle">
                        <div className="tweet-username">
                          <Link
                            to={`${ROUTES.USER_PROFILE}/${
                              message.userId
                            }`}
                          >
                            {this.getUsernameFromUserId(
                              message.userId,
                            )}
                          </Link>
                        </div>
                        <div className="tweet-handle">
                          @
                          {this.getUsernameFromUserId(
                            message.userId,
                          ) !== undefined &&
                            this.getUsernameFromUserId(message.userId)
                              .toLowerCase()
                              .replace(/ /g, '')}
                        </div>
                        <div className="text-block-6">
                          {'· '}
                          <Moment fromNow ago>
                            {message.createdAt}
                          </Moment>
                        </div>
                      </div>
                    </div>
                    <div className="tweet-message-replied">
                      <div className="tweet-message-text">
                        <Link to={`${ROUTES.REPLIES}/${message.uid}`}>
                          {message.text}
                        </Link>
                      </div>
                    </div>
                    <div className="tweet-icon-row">
                      <div className="tweet-username-handle">
                        <div className="tweet-icon-item">
                          <Link
                            onClick={() => this.props.onSetUsers({})}
                            to={`${ROUTES.REPLIES}/${message.uid}`}
                          >
                            <FontAwesomeIcon icon={faCommentAlt} />{' '}
                            <small>{this.state.count}</small>
                          </Link>
                        </div>
                      </div>
                      <div className="div-block-9">
                        <LikeButton
                          authUser={authUser}
                          key={message.uid}
                          message={message}
                          likes={likes}
                        />
                      </div>

                      <div className="div-block-9">
                        <div className="tweet-icon-item">
                          {authUser.uid === message.userId &&
                            !editMode && (
                              <FontAwesomeIcon
                                icon={faEdit}
                                onClick={this.onToggleEditMode}
                              />
                            )}
                        </div>
                      </div>
                      <div>
                        <div className="tweet-icon-item">
                          {authUser.uid === message.userId &&
                            !editMode && (
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                onClick={() =>
                                  onRemoveMessage(message.uid)
                                }
                              />
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}

              {authUser.uid === message.userId && editMode && (
                <span>
                  <button onClick={this.onSaveEditText}>Save</button>
                  <button onClick={this.onToggleEditMode}>
                    Reset
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </Fragment>
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
)(TweetItem);
