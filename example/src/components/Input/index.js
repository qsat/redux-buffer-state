import React, { useCallback } from 'react';
import useBufferState from '../../lib'

const INITIAL_STATE = { value: 'aa' }

export default function Input (props) {
  const [state, setState] = useBufferState({
    name: 'input-test',
    initialState: !props.value ? INITIAL_STATE : props,
    bufferMs: 500,
    syncOnInit: false,
  })
  const handleChange = useCallback(
    (e) => setState({ value: e.target.value }),
    []
  )
  console.log('render')
  return (
    <input type="text" width="200" placeholder="input text..." value={state.value} onChange={handleChange} />
  )
}
