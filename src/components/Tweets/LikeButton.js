import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';

class LikeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      editMode: false,
      editText: this.props.message.text,
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

  getLikeStatus = (message, authUser, likes) => {
    if (likes.length > 0) {
      const num = likes.filter(
        i => i.userId === authUser.uid && i.messageId === message.uid,
      );
      if (num.length !== 0) {
        return true;
      }
      return false;
    }
  };

  onCreateLike = event => {
    this.props.firebase.likes().push({
      messageId: this.props.message.uid,
      userId: this.props.authUser.uid,
    });

    event.preventDefault();
  };

  onRemoveLike = () => {
    const uid = this.props.likes.filter(
      i =>
        i.userId === this.props.authUser.uid &&
        i.messageId === this.props.message.uid,
    )[0].uid;
    this.props.firebase.like(uid).remove();
  };

  getLikeCount = (message, likes) => {
    if (likes.length > 0) {
      const num = likes.filter(i => i.messageId === message.uid);
      if (num.length !== 0) {
        return num.length;
      }
    }
  };

  render() {
    const { authUser, message, likes } = this.props;

    return (
      <Fragment>
        <span>
          {this.getLikeStatus(message, authUser, likes) ? (
            <button onClick={this.onRemoveLike}>Unlike</button>
          ) : (
            <button onClick={this.onCreateLike}>Like</button>
          )}
        </span>
        <span>{this.getLikeCount(message, likes)}</span>
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
)(LikeButton);
