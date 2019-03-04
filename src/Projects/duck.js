import { evolve, assoc, append} from 'ramda'
import { createReducer } from 'redux-ramda'
import { map, mergeMap } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'
import { ofType } from 'redux-observable'

import { createSimpleAction, createConstantAction } from '../redux/helpers'

// Action Types
const prefix = 'opportunity-zones/projects/'

const FETCH = `${prefix}FETCH`
const LOAD = `${prefix}LOAD`
const CREATE = `${prefix}CREATE`
const UPDATE = `${prefix}UPDATE`
const REMOVE = `${prefix}REMOVE`

export const actionTypes = {
  fetch, FETCH,
  load: LOAD,
  create: CREATE,
  // update: UPDATE,
  // remove: REMOVE,
}

// Action Creators
export const fetchProjects = createConstantAction(FETCH)
export const loadProjects = createSimpleAction(LOAD)
export const createProject = createSimpleAction(CREATE)

// Reducer
const initialState = {
  filters: {},
  items: [],
}

export default createReducer(
  initialState, [
    [
      LOAD, assoc('items')
    ],
    [
      CREATE, (item) => evolve({
        items: append(item),
      }),
    ],
])

// Side-effects
export function fetchProjectsEpic(action$) {
  return action$.pipe(
    ofType(FETCH),
    mergeMap(action =>
      ajax.getJSON(`${process.env.REACT_APP_BASE_URL}data/complete-communities-projects.json`)
        .pipe(
          map(loadProjects)
        )
    ),
  )
}