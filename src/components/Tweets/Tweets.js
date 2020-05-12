import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import TweetList from './TweetList';

import Spinner from '../Spinner/Spinner';

import VisibilitySensor from 'react-visibility-sensor';

class Tweets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: true,
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
    // check if there was a change in message limit
    if (props.limit !== this.props.limit) {
      this.onListenForMessages();
      this.onListenForLikes();
    }

    // check that messages in props correspond to selected user
    if (
      (this.props.filterById &&
        this.props.messages[0] &&
        this.props.messages[0].userId !== this.props.filterById) ||
      (this.props.tweetCount > 1 && !this.props.messages[0])
    ) {
      this.onListenForMessages();
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
    this.props.onSetMessagesLimit(5);
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
    this.props.onSetMessagesLimit(this.props.limit + 6);
  };

  onChange = isVisible => {
    if (isVisible) {
      this.onNextPage();
    }
  };

  topFunction = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  render() {
    const { messages, likes, authUser } = this.props;
    const { text, loading } = this.state;

    return (
      <>
        {loading && <Spinner />}

        {!loading &&
          !this.props.filterById &&
          !this.props.filterByReply && (
            <Fragment>
              <div className="content-section">
                <div className="tweets-container">
                  <div className="tweet-wrapper">
                    <div className="tweet-left-box">
                      {authUser.uid !==
                      'VVZwP9faTeT4CtrDtHSS7aKDKZO2' ? (
                        <img
                          src={`https://api.adorable.io/avatars/100/${
                            authUser.uid
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
                    <div className="tweet-right-box">
                      <div className="form-block w-form">
                        <form
                          id="email-form"
                          name="email-form"
                          dataname="Email Form"
                          className="form w-clearfix"
                          onSubmit={event =>
                            this.onCreateMessage(event, authUser)
                          }
                        >
                          <textarea
                            placeholder="Whats happening?"
                            maxLength="5000"
                            id="tweet"
                            name="tweet"
                            dataname="tweet"
                            className="textarea w-input"
                            type="text"
                            value={text}
                            onChange={this.onChangeText}
                          />
                          <input
                            type="submit"
                            value="Tweet"
                            data-wait="Please wait..."
                            className="submit-button w-button"
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-section">
                <div className="tweets-container">
                  <div
                    className="tweet-wrapper"
                    style={{
                      background: '#E4E6E7',
                      height: '10px',
                    }}
                  />
                </div>
              </div>
            </Fragment>
          )}

        {messages && !loading && (
          <TweetList
            authUser={authUser}
            messages={messages}
            likes={likes}
            onEditMessage={this.onEditMessage}
            onRemoveMessage={this.onRemoveMessage}
          />
        )}

        {!loading &&
        messages.length > 4 &&
        !this.props.filterByReply ? (
          <VisibilitySensor onChange={this.onChange}>
            <div className="content-section">
              <br />
              <button
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }
              >
                Back to top
              </button>
            </div>
          </VisibilitySensor>
        ) : (
          <br />
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
