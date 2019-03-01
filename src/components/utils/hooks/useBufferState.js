import React, { useRef, useState, useEffect, useContext } from 'react'
import { ReactReduxContext } from 'react-redux'

const debounce = (ms) => (func) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId)
    timerId = setTimeout(function() {
      func(...args)
    }, ms)
  }
}

const INIT = '@redux-buffer-state/INIT_BUFFER_STATE'
const UPDATE = '@redux-buffer-state/UPDATE_BUFFER_STATE'
const actionCreator = (type, payload) => ({ type, payload })

const DispatchContext = React.createContext(null)
const useDipatch = () => useContext(DispatchContext)

export const ReduxDispatchProvider = ({ children }) => {
  const { store } = useContext(ReactReduxContext);
  return (
    <DispatchContext.Provider value={store.dispatch}>
      {children}
    </DispatchContext.Provider>
  )
}

export default function useBufferState({
  name,
  initialState,
  bufferMs,
  syncOnInit = true,
}) {
  const isMounted = useRef(false)
  const dispatch = useDipatch()
  const [buffer, setBufferState] = useState(initialState)
  const dispatchDebounced = debounce(bufferMs)((s) => dispatch(actionCreator(UPDATE, s)))

  const handleSetState = (newState) => {
    setBufferState(newState)
    dispatchDebounced({name, newState})
  }

  useEffect(() => { 
    if (!isMounted.current && syncOnInit) dispatch(actionCreator(INIT, { name, newState: buffer }))
    isMounted.current = true
  })

  return [buffer, handleSetState]
}

export function debugReducer(state = {}, action) {
  if (![INIT, UPDATE].includes(action.type)) return state
  const { name, newState } = action.payload
  return { ...state, [name]: newState }
}

export function createPartialReducer(targetName, initialState = {}) { 
  return (state = initialState, action) => {
    if (![INIT, UPDATE].includes(action.type)) return state
    const { name, newState } = action.payload

    if (name !== targetName) return state
    return newState
  }
}

// const withBufferState = (name, updateName, initialState) => (
//   (Component) => {
//     const ComponentMemo = React.memo(Component)
//     return (props) => (
//       <ReactReduxContext.Consumer>
//         {({ store: { dispatch } }) => {
//           return <ComponentMemo {...props} />
//         }}
//       </ReactReduxContext.Consumer>
//     )
//   }
// )
