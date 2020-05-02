import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Moment from 'react-moment';

import { withFirebase } from '../Firebase';

import { Tweets } from '../Tweets';

class UserProfileItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      count: '',
    };
  }

  componentDidMount() {
    if (!this.props.user) {
      this.setState({ loading: true });
    }

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.props.onSetUser(
          snapshot.val(),
          this.props.match.params.id,
        );

        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.props.user.email);
  };

  getTweetCount = () => {
    if (this.state.count === '') {
      this.props.firebase
        .messages()
        .orderByChild('userId')
        .equalTo(this.props.match.params.id)
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
    const { user } = this.props;
    const { loading } = this.state;

    // get reply count on every refresh
    this.getTweetCount();

    return (
      <div>
        User Profile ({this.props.match.params.id})
        {loading && <div>Loading ...</div>}
        {user && (
          <div>
            Username: <strong>{user.username}</strong>
            <br />
            Handle: @{user.username.toLowerCase().replace(/ /g, '')}
            <br />
            Joined:{' '}
            <Moment format="MMMM YYYY">{user.joinedAt}</Moment>
            <br />
            Following: <br />
            Followers: <br />
            Tweet count: {this.state.count} <br />
            Tweets: <Tweets filterById={this.props.match.params.id} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: (state.userState.users || {})[props.match.params.id],
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
)(UserProfileItem);
