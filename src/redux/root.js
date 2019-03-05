import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux'
import projects, { fetchProjectsEpic, filterProjectsEpic } from '../Projects/duck'
import filters, { fetchNeighborhoodsEpic } from '../Filters/duck'

export const rootEpic = combineEpics(
  fetchProjectsEpic,
  // filterProjectsEpic,
  fetchNeighborhoodsEpic,
)

export const rootReducer = combineReducers({
  projects,
  filters,
})