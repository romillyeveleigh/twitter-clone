import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      text: '',
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

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  onChange = event => {
    this.setState({ text: event.target.value });
  };

  render() {
    const { users } = this.props;
    const { loading, text } = this.state;

    return (
      <div>
        <form onSubmit={e => e.preventDefault()}>
          <input
            id="search"
            type="search"
            placeholder="Search..."
            ref={text}
            onChange={this.onChange}
          />
        </form>
        {loading && <div>Loading ...</div>}
        <ul>
          {!loading &&
            users
              .filter(user =>
                user.username
                  .toUpperCase()
                  .includes(text.toUpperCase()),
              )
              .map(user => (
                <li key={user.uid}>
                  <img
                    src="http://localhost:3000/img/default_profile_bigger.png"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 400 / 2,
                    }}
                  />
                  <br />
                  <Link to={`${ROUTES.USER_PROFILE}/${user.uid}`}>
                    {user.username}
                  </Link>
                  <br />@
                  {user.username.toLowerCase().replace(/ /g, '')}
                </li>
              ))}
        </ul>
      </div>
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
)(UserList);
