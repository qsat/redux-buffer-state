import { combineReducers } from 'redux'
import counter from './counter'
import { createPartialReducer } from '../../lib'

export default combineReducers({
  counter,
  sample: createPartialReducer('input-test', { value: 'a12' }),
})
