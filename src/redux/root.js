import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux'
import projects, { fetchProjectsEpic } from '../Projects/duck'
import filters, { fetchNeighborhoodsEpic } from '../Filters/duck'

export const rootEpic = combineEpics(
  fetchProjectsEpic,
  fetchNeighborhoodsEpic,
)

export const rootReducer = combineReducers({
  projects,
  filters,
})