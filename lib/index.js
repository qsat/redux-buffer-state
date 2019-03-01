import * as React from 'react';
import { ReactReduxContext } from 'react-redux';
const { useRef, useState, useEffect, useContext } = React;
const debounce = (ms) => (func) => {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(function () {
            func(...args);
        }, ms);
    };
};
const INIT = '@redux-buffer-state/INIT_BUFFER_STATE';
const UPDATE = '@redux-buffer-state/UPDATE_BUFFER_STATE';
function actionCreator(type, payload) { return { type, payload }; }
const DispatchContext = React.createContext(null);
function useDipatch() {
    return useContext(DispatchContext);
}
export const ReduxDispatchProvider = (props) => {
    const { store } = useContext(ReactReduxContext);
    const Provider = DispatchContext.Provider;
    return (React.createElement(Provider, { value: store.dispatch }, props.children));
};
export default function useBufferState({ name, initialState, bufferMs = 100, syncOnInit = true, }) {
    const isMounted = useRef(false);
    const dispatch = useDipatch();
    const [buffer, setBufferState] = useState(initialState);
    const dispatchDebounced = debounce(bufferMs)((s) => dispatch(actionCreator(UPDATE, s)));
    const handleSetState = (newState) => {
        setBufferState(newState);
        dispatchDebounced({ name, newState });
    };
    useEffect(() => {
        if (!isMounted.current && syncOnInit)
            dispatch(actionCreator(INIT, { name, newState: buffer }));
        isMounted.current = true;
    });
    return [buffer, handleSetState];
}
export function debugReducer(state = {}, action) {
    if (action.type !== INIT && action.type !== UPDATE)
        return state;
    const { name, newState } = action.payload;
    return { ...state, [name]: newState };
}
export function createPartialReducer(targetName, initialState) {
    return (state = initialState || {}, action) => {
        if (action.type !== INIT && action.type !== UPDATE)
            return state;
        const { name, newState } = action.payload;
        if (name !== targetName)
            return state;
        return newState;
    };
}
