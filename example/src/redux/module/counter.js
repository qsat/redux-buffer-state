import createActions from 'redux-actions/lib/createActions'
import handleActions from 'redux-actions/lib/handleActions'

// Action Creators
export const {
  counter: {
    increment,
    decrement,
    set,
  }
} = createActions({
  // Action Types
  COUNTER: {
    INCREMENT: () => 1,
    DECREMENT: () => -1,
    SET: (v) => v,
  },
})

const INITIAL_STATE = { counter: 0 }

// reducers
export default handleActions(
  new Map([
    [
      increment,
      (state) => ({ ...state, counter: state.counter + 1}),
    ],
    [
      decrement,
      (state) => ({ ...state, counter: state.counter - 1}),
    ],
    [
      set,
      (state, { payload }) => ({ ...state, val: payload }),
    ],
  ]),
  INITIAL_STATE,
)

