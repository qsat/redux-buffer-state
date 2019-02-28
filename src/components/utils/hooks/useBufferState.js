import { useState, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';

const debounce = (ms) => (func) => {
  let timerId;

  return function(...args) {
    clearTimeout(timerId)
    timerId = setTimeout(function() {
      func(...args)
    }, ms);
  };
}

const INIT = '@redux-buffer-state/INIT_BUFFER_STATE'
const UPDATE = '@redux-buffer-state/UPDATE_BUFFER_STATE'

const actionCreator = (type, payload) => ({ type, payload })

export default function({
  name,
  initialState,
  bufferMs,
}) {
  const { store: { dispatch } } = useContext(ReactReduxContext);
  const [buffer, setBufferState] = useState(initialState)
  const dispatchDebounced = debounce(bufferMs)((s) => dispatch(actionCreator(UPDATE, s)))

  const handleSetState = (newState) => {
    setBufferState(newState)
    dispatchDebounced({name, newState})
  }

  return [buffer, handleSetState]
}

export function reducer(state = {}, action) {
  if (![INIT, UPDATE].includes(action.type)) return state
  
  return {
    ...state,
    [action.payload.name]: action.payload.newState,
  }
}

export const createPartialReducer = (targetName, initialState = {}) => (state = initialState, action) => {
  if (![INIT, UPDATE].includes(action.type)) return state

  const { name, newState } = action.payload

  if (name !== targetName) return state
  
  return newState
}
