import React, { Component } from 'react';
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
      <li>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <span>
            <img
              src="http://localhost:3000/img/default_profile_bigger.png"
              style={{
                width: 50,
                height: 50,
                borderRadius: 400 / 2,
              }}
            />
            <br />
            <small>
              {message.replyToId && (
                <div>
                  Replying to{' '}
                  <Link to={`${ROUTES.REPLIES}/${message.replyTo}`}>
                    @{this.getUsernameFromUserId(message.replyToId)}
                  </Link>
                  <br />
                </div>
              )}
            </small>
            <Link to={`${ROUTES.USER_PROFILE}/${message.userId}`}>
              {this.getUsernameFromUserId(message.userId)}
            </Link>
            <br />@
            {this.getUsernameFromUserId(message.userId) !==
              undefined &&
              this.getUsernameFromUserId(message.userId)
                .toLowerCase()
                .replace(/ /g, '')}
            <br />
            {'• '}
            <Moment fromNow ago>
              {message.createdAt}
            </Moment>
            <br />
            <Link to={`${ROUTES.REPLIES}/${message.uid}`}>
              <strong>{message.text}</strong>
            </Link>
            <br />
            <FontAwesomeIcon icon={faCommentAlt} /> {this.state.count}
            <br />
            <LikeButton
              authUser={authUser}
              key={message.uid}
              message={message}
              likes={likes}
            />
          </span>
        )}

        {authUser.uid === message.userId && (
          <span>
            {editMode ? (
              <span>
                <button onClick={this.onSaveEditText}>Save</button>
                <button onClick={this.onToggleEditMode}>Reset</button>
              </span>
            ) : (
              <div>
                {' '}
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={this.onToggleEditMode}
                />
              </div>
            )}

            {!editMode && (
              <FontAwesomeIcon
                icon={faTrashAlt}
                onClick={() => onRemoveMessage(message.uid)}
              />
            )}
          </span>
        )}
      </li>
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
