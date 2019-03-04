import * as R from 'ramda'

export const createAction = R.curry(
  (type, getPayload, getMeta) => R.compose(
    R.reject(R.isNil),
    R.applySpec({
      type: R.always(type),
      payload: getPayload,
      meta: getMeta,
    })
  )
)

export const createSimpleAction = createAction(
  R.__,
  R.identity,
  R.always(null),
)

export const createConstantAction = createAction(
  R.__,
  R.always(null),
  R.always(null),
)