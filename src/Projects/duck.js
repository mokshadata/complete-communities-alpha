import { evolve, assoc, append, includes } from 'ramda'
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
const SET_NEIGHBORHOOD = `${prefix}SET_NEIGHBORHOOD`
// const UPDATE = `${prefix}UPDATE`
// const REMOVE = `${prefix}REMOVE`
const FILTER = `${prefix}FILTER`

export const actionTypes = {
  fetch, FETCH,
  load: LOAD,
  create: CREATE,
  setNeighborhood: SET_NEIGHBORHOOD,
  // update: UPDATE,
  // remove: REMOVE,
  filter: FILTER,
}

// Action Creators
export const fetchProjects = createConstantAction(FETCH)
export const loadProjects = createSimpleAction(LOAD)
export const createProject = createSimpleAction(CREATE)
export const setNeighborhood = createSimpleAction(SET_NEIGHBORHOOD)
export const filterProjects = createSimpleAction(FILTER)

// Reducer
const initialState = {
  filters: {},
  items: [],
  filteredItems: [],
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
      SET_NEIGHBORHOOD, (neighborhood) => assoc('filters', {
        neighborhood,
      }),
    ],
    [
      FILTER, (state, action) => {
        console.log(state, action)
        return state
      }
    ]
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
    filter((action) => includes(action.type)([LOAD, SET_NEIGHBORHOOD])),
    // mergeMap(filterProjects),
  )
}