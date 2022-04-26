import { createStore, combineReducers } from 'redux'
import { CollApsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'

export default createStore(combineReducers({
  CollApsedReducer,
  LoadingReducer
}))
