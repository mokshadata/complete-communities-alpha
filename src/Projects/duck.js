import { evolve, mergeDeepLeft, assoc, append, includes, keys } from 'ramda'
import { createReducer } from 'redux-ramda'
import { map, mapTo, mergeMap, filter, withLatestFrom } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'
import { ofType } from 'redux-observable'

import { createSimpleAction, createConstantAction } from '../redux/helpers'
import { neighborhoods } from '../redux/constants'

// Action Types
const prefix = 'opportunity-zones/projects/'

const FETCH = `${prefix}FETCH`
const LOAD = `${prefix}LOAD`
const CREATE = `${prefix}CREATE`
// const UPDATE = `${prefix}UPDATE`
// const REMOVE = `${prefix}REMOVE`
const FILTER = `${prefix}FILTER`
const SET_FILTER  = `${prefix}SET_FILTER`
const SET_ACTIVE = `${prefix}SET_ACTIVE`

export const actionTypes = {
  fetch, FETCH,
  load: LOAD,
  create: CREATE,
  // update: UPDATE,
  // remove: REMOVE,
  filter: FILTER,
  setFilter: SET_FILTER,
  setActive: SET_ACTIVE,
}

// Action Creators
export const fetchProjects = createConstantAction(FETCH)
export const loadProjects = createSimpleAction(LOAD)
export const createProject = createSimpleAction(CREATE)
export const filterProjects = createSimpleAction(FILTER)
export const setFilter = createSimpleAction(SET_FILTER)
export const setActive = createSimpleAction(SET_ACTIVE)

// Reducer
const initialState = {
  activeFilters: {
    oz: true,
    neighborhoods: keys(neighborhoods),
  },
  items: [],
  filteredItems: [],
  active: '',
  hello: ''
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
    [
      FILTER, (state, action) => {
        console.log(state, action)
        return state
      }
    ],
    [
      SET_FILTER, (activeFilters) => mergeDeepLeft({ activeFilters })
    ],
    [
      SET_ACTIVE, (project) => assoc('active', project.id)
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

export function filterProjectsEpic(action$, state$) {
  return action$.pipe(
    filter((action) => includes(action.type)([LOAD, SET_FILTER])),
    // mergeMap(filterProjects),
  )
}