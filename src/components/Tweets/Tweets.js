import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import TweetList from './TweetList';

class Tweets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
    };
  }

  componentDidMount() {
    if (!this.props.messages.length) {
      this.setState({ loading: true });
    }

    this.onListenForMessages();
    this.onListenForLikes();
    this.setState({ loading: true });
  }

  componentDidUpdate(props) {
    if (props.limit !== this.props.limit) {
      this.onListenForMessages();
      this.onListenForLikes();
    }
  }

  onListenForMessages = () => {
    // pull messages from firebase from all users

    if (!this.props.filterById && !this.props.filterByReply) {
      this.props.firebase
        .messages()
        .limitToLast(this.props.limit)
        .orderByChild('createdAt')
        // pass messages to the reducer
        .on('value', snapshot => {
          this.props.onSetMessages(snapshot.val());

          this.setState({ loading: false });
        });
    } else if (this.props.filterByReply) {
      // pull replies from firebase
      this.props.firebase
        .messages()
        .limitToLast(this.props.limit)
        .orderByChild('replyTo')
        .equalTo(this.props.filterByReply)
        .on('value', snapshot => {
          this.props.onSetMessages(snapshot.val());

          this.setState({ loading: false });
        });
    } else if (this.props.filterById) {
      // pull all messages from firebase from 1 user
      this.props.firebase
        .messages()
        .limitToLast(this.props.limit)
        .orderByChild('userId')
        .equalTo(this.props.filterById)
        .on('value', snapshot => {
          this.props.onSetMessages(snapshot.val());

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
    const { messages, likes } = this.props;
    const { text, loading } = this.state;

    return (
      <>
        {loading && <div>Loading ...</div>}

        {!loading &&
          !this.props.filterById &&
          !this.props.filterByReply && (
            <Fragment>
              <img
                src={`https://api.adorable.io/avatars/50/${
                  this.props.authUser.uid
                }`}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 400 / 2,
                }}
              />
              <form
                onSubmit={event =>
                  this.onCreateMessage(event, this.props.authUser)
                }
              >
                <input
                  type="text"
                  placeholder="Whats happening?"
                  value={text}
                  onChange={this.onChangeText}
                />
                <button type="submit">Tweet</button>
              </form>
            </Fragment>
          )}

        {messages && !loading && (
          <TweetList
            authUser={this.props.authUser}
            messages={messages}
            likes={likes}
            onEditMessage={this.onEditMessage}
            onRemoveMessage={this.onRemoveMessage}
          />
        )}

        {!loading &&
          messages.length > 4 &&
          !this.props.filterByReply && (
            <button type="button" onClick={this.onNextPage}>
              More
            </button>
          )}

        {!messages && <div>There are no messages ...</div>}
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
)(Tweets);
