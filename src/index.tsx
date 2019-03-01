import * as React from 'react'
import { Dispatch, AnyAction } from 'redux'
import { ReactReduxContext } from 'react-redux'

const { useRef, useState, useEffect, useContext } = React

const debounce = (ms: number) => (func: Function) => {
  let timerId: any;
  return (...args: any[]) => {
    clearTimeout(timerId)
    timerId = setTimeout(function() {
      func(...args)
    }, ms)
  }
}

const INIT = '@redux-buffer-state/INIT_BUFFER_STATE'
const UPDATE = '@redux-buffer-state/UPDATE_BUFFER_STATE'

type Action1<P> = {
  type: '@redux-buffer-state/INIT_BUFFER_STATE' | '@redux-buffer-state/UPDATE_BUFFER_STATE',
  payload: {
    name: string,
    newState: P
  }
}

type Action<P> = AnyAction | Action1<P>

function actionCreator(type: string, payload: any): AnyAction { return { type, payload }}

const DispatchContext = React.createContext(null as any)
function useDipatch<A extends AnyAction = AnyAction>(): Dispatch<A> {
  return useContext(DispatchContext);
}

export const ReduxDispatchProvider = (props: { children: any }) => {
  const { store } = useContext(ReactReduxContext);
  const Provider = DispatchContext.Provider
  return (
    <Provider value={store.dispatch}>
      {props.children}
    </Provider>
  )
}

export default function useBufferState<S>({
  name,
  initialState,
  bufferMs = 100,
  syncOnInit = true,
}: {
  name: string,
  initialState: S,
  bufferMs: number,
  syncOnInit: boolean,
}) {
  const isMounted = useRef(false)
  const dispatch = useDipatch()
  const [buffer, setBufferState] = useState<S>(initialState)
  const dispatchDebounced = debounce(bufferMs)((s: S) => dispatch(actionCreator(UPDATE, s)))

  const handleSetState = (newState: S) => {
    setBufferState(newState)
    dispatchDebounced({name, newState})
  }

  useEffect(() => { 
    if (!isMounted.current && syncOnInit) dispatch(actionCreator(INIT, { name, newState: buffer }))
    isMounted.current = true
  })

  return [buffer, handleSetState]
}

export function debugReducer<S>(state = {}, action: Action<S>) {
  if (action.type !== INIT && action.type !== UPDATE) return state
  const { name, newState } = action.payload
  return { ...state, [name]: newState }
}

export function createPartialReducer<S>(targetName: string, initialState: S) { 
  return (state = initialState || {}, action: Action<typeof initialState>) => {
    if (action.type !== INIT && action.type !== UPDATE) return state
    const { name, newState } = action.payload

    if (name !== targetName) return state
    return newState
  }
}
