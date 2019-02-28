import { combineReducers } from 'redux'
import counter from './counter'
import { createPartialReducer } from '../../components/utils/hooks/useBufferState'

export default combineReducers({
  counter,
  sample: createPartialReducer('input-test', { value: 'a12' }),
})
