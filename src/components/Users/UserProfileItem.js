import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import Moment from 'react-moment';

import { withFirebase } from '../Firebase';

import { Tweets } from '../Tweets';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

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
        {loading && <div>Loading ...</div>}
        {user && (
          <div>
            <Link to="/home">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            {user.username}
            <br />
            {this.state.count ? this.state.count : 0} Tweets
            <br />
            <br />
            <img
              src="http://localhost:3000/img/default_profile_bigger.png"
              style={{
                width: 50,
                height: 50,
                borderRadius: 400 / 2,
              }}
            />
            <h1>{user.username}</h1>@
            {user.username.toLowerCase().replace(/ /g, '')}
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua.
            <br />
            <FontAwesomeIcon icon={faCalendarAlt} /> Joined:{' '}
            <Moment format="MMMM YYYY">{user.joinedAt}</Moment>
            <br />
            Tweets
            <br />
            <Tweets filterById={this.props.match.params.id} />
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
