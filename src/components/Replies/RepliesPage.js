// import React from 'react';
// import { Route } from 'react-router-dom';
// import { compose } from 'recompose';

// import { withAuthorization, withEmailVerification } from '../Session';
// import * as ROUTES from '../../constants/routes';

// const RepliesPage = () => (
//   <div>
//     <h1>Replies Page</h1>
//     <Route
//       exact
//       path={ROUTES.REPLIES_DETAILS}
//       component={RepliesItem}
//     />
//   </div>
// );

// const condition = authUser => authUser;

// export default compose(
//   withEmailVerification,
//   withAuthorization(condition),
// )(RepliesPage);
