import React from 'react';

import TweetItem from './TweetItem';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

const TweetList = ({
  authUser,
  messages,
  likes,
  onEditMessage,
  onRemoveMessage,
}) => {
  // make a shallow copy of the users array, rather than altering it
  const messagesCopy = messages.filter(() => true);

  // reverse order so newest tweets appear first
  messagesCopy.reverse();

  return (
    <TransitionGroup>
      {messagesCopy.map(message => (
        <CSSTransition
          key={message.uid}
          timeout={200}
          classNames="my-node"
        >
          <TweetItem
            authUser={authUser}
            key={message.uid}
            message={message}
            likes={likes}
            onEditMessage={onEditMessage}
            onRemoveMessage={onRemoveMessage}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default TweetList;
