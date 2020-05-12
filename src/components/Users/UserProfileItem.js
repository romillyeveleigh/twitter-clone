import React, { Component, Fragment } from 'react';
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
            <Fragment>
              <div class="content-section">
                <div class="tweets-container">
                  <div class="top-box-wrapper">
                    <div class="title-left-box">
                      <div
                        class="top-box-title"
                        style={{ cursor: 'pointer' }}
                      >
                        <Link to="/home">
                          <FontAwesomeIcon icon={faArrowLeft} />
                          {'   '}
                          {user.username}{' '}
                        </Link>
                        <div
                          style={{
                            fontSize: '12px',
                            marginLeft: '22px',
                            fontWeight: '400',
                          }}
                        >
                          {this.state.count ? this.state.count : 0}{' '}
                          Tweets
                          <br />{' '}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
            <Fragment>
              <div className="content-section">
                <div className="tweets-container">
                  <div className="profile-box-wrapper">
                    <div className="div-block-12">
                      <img
                        src={`https://api.adorable.io/avatars/100/${
                          this.props.match.params.id
                        }`}
                        alt=""
                        className="avatar-large"
                      />
                    </div>

                    <div className="profile-lower-box">
                      <div className="profile-username">
                        {user.username}
                      </div>
                      <div className="tweet-handle">
                        @
                        {user.username
                          .toLowerCase()
                          .replace(/ /g, '')}
                      </div>

                      <div className="text-block-6-copy">
                        Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit, sed do eiusmod teasdfasfdsfd
                        asfd asmpor incididunt ut labore et dolore
                        magna aliqua.
                      </div>

                      <div className="text-block-6-copy">
                        <FontAwesomeIcon icon={faCalendarAlt} />{' '}
                        Joined:{' '}
                        <Moment format="MMMM YYYY">
                          {user.joinedAt}
                        </Moment>
                      </div>
                    </div>

                    <div className="div-block-14">
                      <div className="div-block-13">
                        <div className="tweet-message-replied-copy">
                          Tweets
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
            <Tweets
              filterById={this.props.match.params.id}
              tweetCount={this.state.count}
            />
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
