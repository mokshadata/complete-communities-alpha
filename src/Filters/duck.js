import { includes, assoc, keys} from 'ramda'
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

export const actionTypes = {
  fetch, FETCH,
  load: LOAD,
}

// Action Creators
export const fetchNeighborhoods = createConstantAction(FETCH)
export const loadNeighborhoods = createSimpleAction(LOAD)

export function filterGeoJSON(geoJSON) {
  return geoJSON.features.filter((item) => (
    includes(item.properties.SNBNAME, keys(neighborhoods))
  ))
}

// Reducer
const initialState = {
  neighborhoods: [],
}

export default createReducer(
  initialState, [
    [
      LOAD, assoc('neighborhoods')
    ],
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