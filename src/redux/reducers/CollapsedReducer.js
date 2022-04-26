import { CHANGE_COLLAPSED } from '../constant'
const initState = false
export const CollApsedReducer = (prevState = initState, action) => {
  let { type, data } = action
  switch (type) {
    case CHANGE_COLLAPSED:
      return !data
    default:
      return prevState
  }
}