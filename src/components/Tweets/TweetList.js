import React from 'react';

import TweetItem from './TweetItem';

const TweetList = ({
  authUser,
  messages,
  likes,
  onEditMessage,
  onRemoveMessage,
  onLikeTweet,
}) => {
  // make a shallow copy of the users array, rather than altering it
  const messagesCopy = messages.filter(() => true);

  // reverse order so newest tweets appear first
  messagesCopy.reverse();

  return (
    <ul>
      {messagesCopy.map(message => (
        <TweetItem
          authUser={authUser}
          key={message.uid}
          message={message}
          likes={likes}
          onEditMessage={onEditMessage}
          onRemoveMessage={onRemoveMessage}
        />
      ))}
    </ul>
  );
};

export default TweetList;
