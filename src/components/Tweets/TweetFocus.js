import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import TweetList from './TweetList';

import Spinner from '../Spinner/Spinner';

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
    const { message, likes } = this.props;
    const { text, loading } = this.state;
    if (message[0]) {
      message[0].uid = this.props.filterByTweet;
    }

    return (
      <>
        {loading ? (
          <Spinner />
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
          <Fragment>
            <div className="content-section">
              <div className="tweets-container">
                <div className="tweet-wrapper">
                  <div className="tweet-left-box">
                    {this.props.authUser.uid !==
                    'VVZwP9faTeT4CtrDtHSS7aKDKZO2' ? (
                      <img
                        src={`https://api.adorable.io/avatars/100/${
                          this.props.authUser.uid
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
                          this.onCreateMessage(
                            event,
                            this.props.authUser,
                          )
                        }
                      >
                        <textarea
                          placeholder="Tweet your reply"
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
                          value="Reply"
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
                    background: '#d3d3d3',
                    height: '10px',
                  }}
                />
              </div>
            </div>
          </Fragment>
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
