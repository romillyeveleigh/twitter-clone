import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';

import Spinner from '../Spinner/Spinner';

import { TweetFocus, Tweets } from '../Tweets';

class RepliesItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.match.params.uid) {
      this.setState({ loading: true });
    }

    this.props.firebase
      .message(this.props.match.params.uid)
      .on('value', snapshot => {
        this.props.onSetUser(
          snapshot.val(),
          this.props.match.params.uid,
        );

        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    this.props.firebase.message(this.props.match.params.uid).off();
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        {loading && <Spinner />}
        {!loading && this.props.match.params.uid && (
          <div>
            <TweetFocus filterByTweet={this.props.match.params.uid} />
            <Tweets filterByReply={this.props.match.params.uid} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: (state.userState.users || {})[props.match.params.uid],
});

const mapDispatchToProps = dispatch => ({
  onSetUser: (user, uid) => dispatch({ type: 'USER_SET', user, uid }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RepliesItem);
