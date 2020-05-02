import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import TweetList from './TweetList';

class TweetFocus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: true,
    };
  }

  componentDidMount() {
    if (!this.props.messages.length || !this.props.filterByTweet) {
      this.setState({ loading: true });
    }

    this.onListenForMessages();
    this.onListenForLikes();
  }

  componentDidUpdate(props) {
    if (
      props.limit !== this.props.limit ||
      this.props.filterByTweet !== props.filterByTweet
    ) {
      this.setState({ loading: true });

      this.onListenForMessages();
      this.onListenForLikes();
    }
  }

  onListenForMessages = () => {
    // pull messages from firebase from all users
    if (this.props.filterByTweet) {
      // pull 1 message from firebase
      this.props.firebase
        .message(this.props.filterByTweet)
        .on('value', snapshot => {
          this.props.onSetMessage([snapshot.val()]);

          this.setState({ loading: false });
        });
    }
  };

  onListenForLikes = () => {
    this.props.firebase.likes().on('value', snapshot => {
      this.props.onSetLikes(snapshot.val());

      this.setState({ loading: false });
    });
  };

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      replyTo: this.props.filterByTweet,
      replyToId: this.props.message[0].userId,
    });

    this.setState({ text: '' });

    event.preventDefault();
  };

  onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    this.props.firebase.message(message.uid).set({
      ...messageSnapshot,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onNextPage = () => {
    this.props.onSetMessagesLimit(this.props.limit + 5);
  };

  render() {
    const { message, messages, likes } = this.props;
    const { text, loading } = this.state;
    if (message[0]) {
      message[0].uid = this.props.filterByTweet;
    }

    return (
      <>
        {loading ? (
          <div>Loading ...</div>
        ) : (
          <TweetList
            authUser={this.props.authUser}
            messages={message}
            likes={likes}
            onEditMessage={this.onEditMessage}
            onRemoveMessage={this.onRemoveMessage}
          />
        )}
        {!this.props.filterById && (
          <form
            onSubmit={event =>
              this.onCreateMessage(event, this.props.authUser)
            }
          >
            <input
              type="text"
              value={text}
              onChange={this.onChangeText}
            />
            <button type="submit">Reply</button>
          </form>
        )}

        {!message && <div>Message not found ...</div>}
      </>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  messages: Object.keys(state.messageState.messages || {}).map(
    key => ({
      ...state.messageState.messages[key],
      uid: key,
    }),
  ),
  likes: Object.keys(state.likeState.likes || {}).map(key => ({
    ...state.likeState.likes[key],
    uid: key,
  })),
  limit: state.messageState.limit,
  message: Object.keys(state.messageState.message || {}).map(key => ({
    ...state.messageState.message[key],
    uid: key,
  })),
});

const mapDispatchToProps = dispatch => ({
  onSetMessages: messages =>
    dispatch({ type: 'MESSAGES_SET', messages }),
  onSetMessage: messages =>
    dispatch({ type: 'MESSAGE_SET', messages }),
  onSetMessagesLimit: limit =>
    dispatch({ type: 'MESSAGES_LIMIT_SET', limit }),
  onSetLikes: likes => dispatch({ type: 'LIKES_SET', likes }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(TweetFocus);
