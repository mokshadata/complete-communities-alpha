import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux'
import projects, { fetchProjectsEpic } from '../Projects/duck'

export const rootEpic = combineEpics(
  fetchProjectsEpic,
)

export const rootReducer = combineReducers({
  projects,
})