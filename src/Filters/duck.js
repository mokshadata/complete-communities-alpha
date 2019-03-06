import { includes, assoc, keys } from 'ramda'
import { createReducer } from 'redux-ramda'
import { map, mergeMap } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'
import { ofType } from 'redux-observable'

import { createSimpleAction, createConstantAction } from '../redux/helpers'
import { neighborhoods } from '../redux/constants'

// Action Types
const prefix = 'opportunity-zones/neighborhoods/'

const FETCH = `${prefix}FETCH`
const LOAD = `${prefix}LOAD`

const LOAD_PROGRAM_FILTERS = `${prefix}LOAD_PROGRAM_FILTERS`

export const actionTypes = {
  fetch, FETCH,
  load: LOAD,
  loadProgramFilters: LOAD_PROGRAM_FILTERS,
}

// Action Creators
export const fetchNeighborhoods = createConstantAction(FETCH)
export const loadNeighborhoods = createSimpleAction(LOAD)
export const loadProgramFilters = createSimpleAction(LOAD_PROGRAM_FILTERS)

export function filterGeoJSON(geoJSON) {
  const features = geoJSON.features.filter((item) => (
    includes(item.properties.SNBNAME, keys(neighborhoods))
  ))

  return assoc('features', features)({
    type: 'FeatureCollection',
  })
}

// Reducer
const initialState = {
  neighborhoods: {
    features: [],
    type: 'FeatureCollection',
  },
  projects: {},
}

export default createReducer(
  initialState, [
    [
      LOAD, assoc('neighborhoods')
    ],
    // [
    //   LOAD_PROGRAM_FILTERS, (programs) => (
    //     pipe(
    //       pick(['eligiblePrograms', 'excludedPrograms', 'Section', 'Prority', 'Timeline', 'Lead Partners', 'Support Partners', 'Potential Programs']),
    //       mapObjIndexed((program) => ())
    //     )
    //   )
    // ],
])

// Side-effects
export function fetchNeighborhoodsEpic(action$) {
  return action$.pipe(
    ofType(FETCH),
    mergeMap(action =>
      ajax.getJSON(`${process.env.REACT_APP_BASE_URL}data/Super_Neighborhoods.geojson`)
        .pipe(
          map(filterGeoJSON),
          map(loadNeighborhoods),
        )
    ),
  )
}