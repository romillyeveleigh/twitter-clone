const INITIAL_STATE = {
  likes: null,
};

const applySetLikes = (state, action) => ({
  ...state,
  likes: action.likes,
});

function likeReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'LIKES_SET': {
      return applySetLikes(state, action);
    }
    default:
      return state;
  }
}

export default likeReducer;
