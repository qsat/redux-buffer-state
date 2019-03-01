import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { debugReducer } from './components/utils/hooks/useBufferState';
import appReducer from './redux/module/reducer';
import './index.css';
import App from './components/App';
import { ReduxDispatchProvider } from './components/utils/hooks/useBufferState'
import * as serviceWorker from './serviceWorker';

const store = createStore(
  combineReducers({
    app: appReducer,
    uiDebug: debugReducer,
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
  <Provider store={store}>
    <ReduxDispatchProvider>
      <App />
    </ReduxDispatchProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
